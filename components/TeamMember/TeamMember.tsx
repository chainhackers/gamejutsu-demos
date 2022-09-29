import Image from 'next/image';
import {TeamMemberPropsI} from './TeamMemberProps';
import styles from './TeamMember.module.scss';
import React from "react";

export const TeamMember: React.FC<TeamMemberPropsI> = ({
                                                           image,
                                                           name,
                                                           role,
                                                           description,
                                                           link
                                                       }) => {
    return (
        <div className={styles.container}>
            <div className={styles.avatar}>
                <Image className={styles.image} src={image} width="155px" height="155px"/>
            </div>
            <div className={styles.information}>
                <div className={styles.name}>{name}</div>
                <div className={styles.role}>{role}</div>
                <div className={styles.description}>{description}</div>
                {link && <div><br/> <a className={styles.link} href={link} target="_blank" rel="noreferrer">{link}</a></div>}
            </div>
        </div>
    );
};
