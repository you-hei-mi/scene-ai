import { ExtensionEntity } from "@buildingai/core/decorators";
import { Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@ExtensionEntity()
export class GenerationTask {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "uuid", nullable: true })
    canvasId?: string;

    @Column({ type: "uuid", nullable: true })
    nodeId?: string;

    @Column({ length: 40 })
    kind: "image" | "video" | "llm" | "workflow";

    @Column({ length: 40, default: "queued" })
    status: "queued" | "running" | "done" | "failed";

    @Column({ type: "jsonb", default: () => "'{}'::jsonb" })
    input: Record<string, unknown>;

    @Column({ type: "jsonb", default: () => "'{}'::jsonb" })
    output: Record<string, unknown>;

    @Column({ type: "text", nullable: true })
    error?: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
