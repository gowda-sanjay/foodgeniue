import { z } from 'zod';

export const chatSchema = z.object({
  body: z.object({
    message: z.string().min(1),
    context: z.optional(z.any())
  })
});

export const searchSchema = z.object({
  body: z.object({
    query: z.string().min(1)
  })
});

export const imageSchema = z.object({
  body: z.object({
    imageUrl: z.string().url()
  })
});

export const voiceSchema = z.object({
  body: z.object({
    audioUrl: z.string().url()
  })
});

export const recommendSchema = z.object({
  body: z.object({
    preferences: z.string().optional(),
    context: z.optional(z.any())
  })
});
