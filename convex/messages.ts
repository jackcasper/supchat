import { v } from "convex/values";
import { QueryCtx, mutation, query } from "./_generated/server";
import { auth } from "./auth";
import { Doc, Id } from "./_generated/dataModel";
import { paginationOptsValidator } from "convex/server";

const populateReactions = (ctx: QueryCtx, messageId: Id<"messages">) => {
    return ctx.db
        .query("reactions")
        .withIndex("by_message_id", (q) => q.eq("messageId", messageId))
        .collect();
};

const populateThread = async (ctx: QueryCtx, messageId: Id<"messages">) => {
    const messages = await ctx.db
        .query("messages")
        .withIndex("by_parent_message_id", (q) =>
            q.eq("parentMessageId", messageId)
        )
        .collect();
    
    if (messages.length === 0) {
        return {
            count: 0,
            timestamp: 0,
            image: undefined,
            name: "",
        };
    }

    const lastMessage = messages[messages.length - 1];
    const lastMessageMember = await populateMember(ctx, lastMessage.memberId);

    if (!lastMessageMember) {
        return {
            count: 0,
            timestamp: 0,
            image: undefined,
            name: "",
        };
    }

    const lastMessageUser = await populateUser(ctx, lastMessageMember.userId);

    return {
        count: messages.length,
        timestamp: lastMessage._creationTime,
        image: lastMessageUser?.image,
        name: lastMessageUser?.name,
    };
};

const populateUser = (ctx: QueryCtx, userId: Id<"users">) => {
    return ctx.db.get(userId);
};

const populateMember = (ctx: QueryCtx, memberId: Id<"members">) => {
    return ctx.db.get(memberId);
};

const getMember = async (
    ctx: QueryCtx,
    workspaceId: Id<"workspaces">,
    userId: Id<"users">
) => {
    return ctx.db
        .query("members")
        .withIndex("by_workspace_id_user_id", (q) =>
            q.eq("workspaceId", workspaceId).eq("userId", userId),
        )
        .unique();
};

export const update = mutation({
    args: {
        id: v.id("messages"),
        body: v.string(),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);

        if (!userId) {
            throw new Error("Unauthorized");
        }

        const message = await ctx.db.get(args.id);

        if (!message) {
            throw new Error("Message not found");
        }

        const member = await getMember(ctx, message.workspaceId, userId);

        if (!member || member._id !== message.memberId) {
            throw new Error("Unauthorized");
        }

        await ctx.db.patch(args.id, {
            body: args.body,
            updatedAt: Date.now(),
        });

        return args.id;
    },
});

export const remove = mutation({
    args: {
        id: v.id("messages"),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);

        if (!userId) {
            throw new Error("Unauthorized");
        }

        const message = await ctx.db.get(args.id);

        if (!message) {
            throw new Error("Message not found");
        }

        const member = await getMember(ctx, message.workspaceId, userId);

        if (!member || member._id !== message.memberId) {
            throw new Error("Unauthorized");
        }

        await ctx.db.delete(args.id);

        return args.id;
    },
});

export const getById = query({
    args: {
        id: v.id("messages"),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);

        if (!userId) {
            return null;
        }

        const message = await ctx.db.get(args.id);

        if (!message) {
            return null;
        }

        const currentMember = await getMember(ctx, message.workspaceId, userId);

        if (!currentMember) {
            return null;
        }

        const member = await populateMember(ctx, message.memberId);

        if (!member) {
            return null;
        }

        const user = await populateUser(ctx, member.userId);

        if (!user) {
            return null;
        }

        const reactions = await populateReactions(ctx, message._id);
        
        const reactionsCount = reactions.map((reaction) => {
            return {
                ...reaction,
                count: reactions.filter((r) => r.value === reaction.value).length,
            };
        });

        const duplicatedReactions = reactionsCount.reduce(
            (acc, reaction) => {
                const existingReaction = acc.find(
                    (r) => r.value === reaction.value,
                );
                
                if (existingReaction) {
                    existingReaction.memberIds = Array.from(
                        new Set([...existingReaction.memberIds, reaction.memberId])
                    );
                } else {
                    acc.push({ ...reaction, memberIds: [reaction.memberId] });
                }

                return acc;
            },
            [] as (Doc<"reactions"> & {
                count: number;
                memberIds: Id<"members">[];
            })[]
        );

        const reactionsWithoutMemberIdProperty = duplicatedReactions.map(
            ({ memberId, ...rest }) => rest,
        );

        return {
            ...message,
            image: message.image
                ? await ctx.storage.getUrl(message.image)
                : undefined,
            user,
            member,
            reactions: reactionsWithoutMemberIdProperty,
        };
    },
})

export const get = query({
    args: {
        conversationId: v.optional(v.id("conversations")),
        channelId: v.optional(v.id("channels")),
        parentMessageId: v.optional(v.id("messages")),
        paginationOpts: paginationOptsValidator,
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);

        if (!userId) {
            throw new Error("401: Unauthorized");
        }

        let _conversationId = args.conversationId;

        if (!args.conversationId && !args.channelId && args.parentMessageId) {
            const parentMessage = await ctx.db.get(args.parentMessageId);

            if (!parentMessage) {
                throw new Error("Parent message not found");
            }
            
            _conversationId = parentMessage.conversationId;
        }

        const results = await ctx.db
            .query("messages")
            .withIndex("by_channel_id_parent_message_id_conversation_id", (q) =>
                q
                    .eq("channelId", args.channelId)
                    .eq("parentMessageId", args.parentMessageId)
                    .eq("conversationId", _conversationId)
            )
            .order("desc")
            .paginate(args.paginationOpts);
        
        return {
            ...results,
            page: (
                await Promise.all(
                    results.page.map(async (message) => {
                        const member = await populateMember(ctx, message.memberId);
                        if (!member) {
                            return null
                        };

                        const user = member ? await populateUser(ctx, member.userId) : null;

                        if (!user) {
                            return null
                        };

                        const thread = await populateThread(ctx, message._id);
                        const reactions = await populateReactions(ctx, message._id);
                        const image = message.image
                            ? await ctx.storage.getUrl(message.image)
                            : undefined;
                        
                        const reactionsCount = reactions.map((reaction) => {
                            return {
                                ...reaction,
                                count: reactions.filter((r) => r.value === reaction.value).length,
                            };
                        });

                        const duplicatedReactions = reactionsCount.reduce(
                            (acc, reaction) => {
                                const existingReaction = acc.find(
                                    (r) => r.value === reaction.value,
                                );

                                if (existingReaction) {
                                    existingReaction.memberIds = Array.from(
                                        new Set([...existingReaction.memberIds, reaction.memberId])
                                    );
                                } else {
                                    acc.push({ ...reaction, memberIds: [reaction.memberId] });
                                }

                                return acc;
                            },
                            [] as (Doc<"reactions"> & {
                                count: number;
                                memberIds: Id<"members">[];
                            })[]
                        );

                        const reactionsWithoutMemberIdProperty = duplicatedReactions.map(
                            ({ memberId, ...rest }) => rest,
                        );

                        return {
                            ...message,
                            user,
                            image,
                            member,
                            threadCount: thread.count,
                            threadTimestamp: thread.timestamp,
                            threadImage: thread.image,
                            threadName: thread.name,
                            reactions: reactionsWithoutMemberIdProperty,
                        };
                    })
                )
            ).filter(
                (message): message is NonNullable<typeof message> => message !== null
            )
        };
    },
});

export const create = mutation({
    args: {
        body: v.string(),
        image: v.optional(v.id("_storage")),
        channelId: v.optional(v.id("channels")),
        workspaceId: v.id("workspaces"),
        parentMessageId: v.optional(v.id("messages")),
        conversationId: v.optional(v.id("conversations")),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);

        if (!userId) {
            throw new Error("401: Unauthorized");
        }

        const member = await getMember(ctx, args.workspaceId, userId);
        
        if (!member) {
            throw new Error("403: Unauthorized");
        }

        let _conversationId = args.conversationId;

        // Only possible if we are replying in thread in 1:1 conversation
        if (!args.conversationId && !args.channelId && args.parentMessageId) {
            const parentMessage = await ctx.db.get(args.parentMessageId);

            if (!parentMessage) {
                throw new Error("Parent message not found");
            }

            _conversationId = parentMessage.conversationId;
        }

        const messageId = await ctx.db.insert("messages", {
            memberId: member._id,
            body: args.body,
            image: args.image,
            channelId: args.channelId,
            workspaceId: args.workspaceId,
            parentMessageId: args.parentMessageId,
            conversationId: _conversationId,
        });
        
        return messageId;
    },
});

export const search = query({
    args: {
        workspaceId: v.id("workspaces"),
        search: v.string(),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) throw new Error("Unauthorized");

        const member = await getMember(ctx, args.workspaceId, userId);
        if (!member) throw new Error("Unauthorized");

        const lowerSearch = args.search.toLowerCase();

        const messages = await ctx.db
            .query("messages")
            .withIndex("by_workspace_id", q => q.eq("workspaceId", args.workspaceId))
            .collect();
        
        const filtered = messages.filter(m =>
            m.body.toLowerCase().includes(lowerSearch)
        );

        return filtered.slice(0, 10);
    },
});