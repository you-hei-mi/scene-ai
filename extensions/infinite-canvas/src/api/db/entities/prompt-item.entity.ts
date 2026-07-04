import { ExtensionEntity } from "@buildingai/core/decorators";
import { Column, CreateDateColumn, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { PromptCategory } from "./prompt-category.entity";

@ExtensionEntity()
export class PromptItem {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "uuid" })
    categoryId: string;

    @Column({ length: 180 })
    title: string;

    @Column({ type: "text" })
    prompt: string;

    @Column({ type: "text", nullable: true })
    negativePrompt?: string;

    @Column({ type: "jsonb", default: () => "'{}'::jsonb" })
    params: Record<string, unknown>;

    @Column({ type: "jsonb", default: () => "'[]'::jsonb" })
    tags: string[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => PromptCategory, (category) => category.items)
    @JoinColumn({ name: "categoryId" })
    category?: PromptCategory;
}
