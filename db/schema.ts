import {sqliteTable,text,integer,index} from 'drizzle-orm/sqlite-core';
export const campMemories=sqliteTable('camp_memories',{
 id:text('id').primaryKey(),nickname:text('nickname').notNull(),caption:text('caption').notNull(),story:text('story').notNull().default(''),gear:text('gear').notNull().default(''),
 imageKey:text('image_key').notNull(),imageType:text('image_type').notNull(),status:text('status').notNull().default('pending'),createdAt:integer('created_at').notNull(),reviewedAt:integer('reviewed_at'),
 consent:integer('consent').notNull().default(1)
},t=>[index('camp_memories_status_created').on(t.status,t.createdAt)]);
export const campMemoryLimits=sqliteTable('camp_memory_limits',{id:text('id').primaryKey(),day:text('day').notNull(),count:integer('count').notNull().default(0)});
