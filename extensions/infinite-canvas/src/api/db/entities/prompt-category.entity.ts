import { ExtensionEntity } from "@buildingai/core/decorators";
import {
    Column,
    CreateDateColumn,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

import { PromptItem } from "./prompt-item.entity";
import { PromptLibrary } from "./prompt-library.entity";

@ExtensionEntity()
export class PromptCategory {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "uuid" })
    libraryId: string;

    @Column({ length: 120 })
    name: string;

    @Column({ type: "int", default: 0 })
    sort: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => PromptLibrary, (library) => library.categories)
    @JoinColumn({ name: "libraryId" })
    library?: PromptLibrary;

    @OneToMany(() => PromptItem, (item) => item.category)
    items?: PromptItem[];
}
