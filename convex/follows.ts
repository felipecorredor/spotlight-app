import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Obtener todos los seguidores de un usuario
export const getFollowers = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const followers = await ctx.db
      .query("follows")
      .withIndex("by_following", (q) => q.eq("followingId", args.userId))
      .collect();

    // Obtener la información de los usuarios que siguen
    const followerUsers = await Promise.all(
      followers.map(async (follow) => {
        const user = await ctx.db.get(follow.followerId);
        return user;
      })
    );

    return followerUsers;
  },
});

// Obtener todos los usuarios que sigue un usuario
export const getFollowing = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const following = await ctx.db
      .query("follows")
      .withIndex("by_follower", (q) => q.eq("followerId", args.userId))
      .collect();

    // Obtener la información de los usuarios seguidos
    const followingUsers = await Promise.all(
      following.map(async (follow) => {
        const user = await ctx.db.get(follow.followingId);
        return user;
      })
    );

    return followingUsers;
  },
});

// Verificar si un usuario sigue a otro
export const isFollowing = query({
  args: {
    followerId: v.id("users"),
    followingId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const follow = await ctx.db
      .query("follows")
      .withIndex("by_both", (q) =>
        q.eq("followerId", args.followerId).eq("followingId", args.followingId)
      )
      .first();

    return !!follow;
  },
});

// Seguir a un usuario
export const followUser = mutation({
  args: {
    followerId: v.id("users"),
    followingId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Verificar si ya existe la relación
    const existingFollow = await ctx.db
      .query("follows")
      .withIndex("by_both", (q) =>
        q.eq("followerId", args.followerId).eq("followingId", args.followingId)
      )
      .first();

    if (existingFollow) {
      return null; // Ya existe la relación
    }

    // Crear la relación de follow
    const followId = await ctx.db.insert("follows", {
      followerId: args.followerId,
      followingId: args.followingId,
    });

    // Actualizar contadores de seguidores
    const followingUser = await ctx.db.get(args.followingId);
    if (followingUser) {
      await ctx.db.patch(args.followingId, {
        followers: (followingUser.followers || 0) + 1,
      });
    }

    return followId;
  },
});

// Dejar de seguir a un usuario
export const unfollowUser = mutation({
  args: {
    followerId: v.id("users"),
    followingId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Buscar la relación
    const follow = await ctx.db
      .query("follows")
      .withIndex("by_both", (q) =>
        q.eq("followerId", args.followerId).eq("followingId", args.followingId)
      )
      .first();

    if (!follow) {
      return null; // No existe la relación
    }

    // Eliminar la relación
    await ctx.db.delete(follow._id);

    // Actualizar contadores de seguidores
    const followingUser = await ctx.db.get(args.followingId);
    if (followingUser) {
      await ctx.db.patch(args.followingId, {
        followers: Math.max(0, (followingUser.followers || 0) - 1),
      });
    }

    return follow._id;
  },
});
