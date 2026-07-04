import { ExtensionEntity } from "@buildingai/core/decorators";
import { Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@ExtensionEntity()
export class Conversation {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ length: 160, default: "新对话" })
    title: string;

    @Column({ type: "jsonb", default: () => "'[]'::jsonb" })
    messages: unknown[];

    @Column({ length: 80, default: "buildingai" })
    provider: string;

    @Column({ type: "jsonb", default: () => "'{}'::jsonb" })
    settings: Record<string, unknown>;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
