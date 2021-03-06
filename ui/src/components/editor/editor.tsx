import * as React from "react";
import {useState} from "react";
import AvataaarsCustomerizer from '../avatar-customizer/avatar-customizer';
import styles from './editor.module.css';
import a11y from '../../styles/a11y.module.css';
import {X, Save, Trash2, CornerDownLeft} from "react-feather";
import {IServerUser} from "../../../../typings/index";
import {IAvatarAttributes} from "../avatar/profil-avatar";

interface IProps {
    user: IServerUser;
    onSave: (editedUser: IServerUser) => void
    onDelete: (user: IServerUser) => void
    onCancel: () => void
    numberOfUsers: number;
}

export const Editor = ({user, onSave, onCancel, onDelete, numberOfUsers} :IProps) => {
    const [editableUser, setEditableUser] = useState<IServerUser>(user)
    function handleAvatarChange(customizedAttributes: IAvatarAttributes) {
        setEditableUser({
            ...editableUser,
            avatar: customizedAttributes
        })
    }

    function handleNameChange(event: React.ChangeEvent<HTMLInputElement>){
        setEditableUser({
            ...editableUser,
            name: event.target.value
        })
    }

    function handleUndo(user: IServerUser){
        setEditableUser({
            ...user
        })
    }

    return (
        <div className={styles.editor}>
            <button className={styles.closeBtn} onClick={onCancel}>
                <X color="white"/>
                <span className={a11y.hidden}>Stäng</span>
            </button>
            <div className={styles.editorInner}>
                <div className={styles.body}>
                    <AvataaarsCustomerizer
                        value={editableUser.avatar}
                        name={editableUser.name}
                        onChange={handleAvatarChange}
                        onNameChange={handleNameChange}
                    />
                </div>
                <div className={styles.footer}>
                    <button className={styles.btn} onClick={() =>
                        handleUndo(user)
                    }>
                        <CornerDownLeft color="white" />Ångra ändringar
                    </button>
                    <button disabled={numberOfUsers < 2} className={styles.btn} onClick={() => {
                        onDelete({...user})
                    }}>
                        <Trash2 color="white"/>Radera
                    </button>
                    <button className={styles.btn} onClick={() => {
                        onSave(editableUser)
                    }}>
                        <Save color="white" />Spara
                    </button>
                </div>
            </div>
        </div>
    )
};
