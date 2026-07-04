import { ExtensionEntity } from "@buildingai/core/decorators";
import { Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@ExtensionEntity()
export class AiProviderProfile {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ length: 120 })
    name: string;

    @Column({ length: 40 })
    protocol: string;

    @Column({ length: 1000, nullable: true })
    baseUrl?: string;

    @Column({ type: "jsonb", default: () => "'[]'::jsonb" })
    imageModels: string[];

    @Column({ type: "jsonb", default: () => "'[]'::jsonb" })
    chatModels: string[];

    @Column({ type: "jsonb", default: () => "'[]'::jsonb" })
    videoModels: string[];

    @Column({ type: "jsonb", default: () => "'{}'::jsonb" })
    extra: Record<string, unknown>;

    @Column({ default: true })
    enabled: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
