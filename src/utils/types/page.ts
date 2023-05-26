import { type Prisma } from "@prisma/client"
import { z } from "zod"
import { ComponentTypeSchema } from "../components/AddComponent"

const data = {
	select: {content: true, properties: true}
} satisfies Prisma.EditableDataArgs

const settingsWithData ={
	include: {data: data}
} satisfies Prisma.ComponentSettingsArgs

const pageWithSettings = {
	include: { settings: settingsWithData}
} satisfies Prisma.PageArgs



//export type ComponentSettings = Prisma.ComponentSettingsGetPayload<typeof settingsWithData>
//export type EventPage = Prisma.PageGetPayload<typeof pageWithSettings>
//export type EditableData = Prisma.EditableDataGetPayload<typeof data>

export const EditableDataSchema = z.object({
	content: z.string(),
	properties: z.string().nullable()
}) satisfies z.Schema<Prisma.EditableDataGetPayload<typeof data>>
export type EditableData = z.infer<typeof EditableDataSchema>

export const ComponentSettingsSchema = z.object({
	id: z.number(),
	pageId: z.string(),
	component: ComponentTypeSchema,
	data: EditableDataSchema
}) satisfies z.Schema<Prisma.ComponentSettingsGetPayload<typeof settingsWithData>>
export type ComonponentSettings = z.infer<typeof ComponentSettingsSchema>

export const PageSchema = z.object({
	id: z.string(),
	title: z.string(),
	description: z.string(),
	settings: z.array(ComponentSettingsSchema)
}) satisfies z.Schema<Prisma.PageGetPayload<typeof pageWithSettings>>
export type EventPage = z.infer<typeof PageSchema>