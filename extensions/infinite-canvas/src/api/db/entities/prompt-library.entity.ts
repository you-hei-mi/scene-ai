import { ExtensionEntity } from "@buildingai/core/decorators";
import { Column, CreateDateColumn, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { PromptCategory } from "./prompt-category.entity";

@ExtensionEntity()
export class PromptLibrary {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ length: 120 })
    name: string;

    @Column({ type: "int", default: 0 })
    sort: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => PromptCategory, (category) => category.library)
    categories?: PromptCategory[];
}
