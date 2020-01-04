import * as React from "react";
import {useEffect, useState} from "react";
import styles from './options.module.css';
import storage from '../../../../utils/storage'
import {Editor} from "../editor/editor";
import Avatar from "avataaars";
import classNames from 'classnames';
// @ts-ignore
import {Plus} from "react-feather";
import a11y from "../../styles/a11y.module.css";
import {IServerUser} from "../../../../typings/index";
import server from "../../../../utils/server";
import timeMachine from "../avatar-customizer/time-machine";
import {AvatarRevealer} from "../avatar-customizer/avatar-revealer";
import {Emotion, withEmotion} from "../avatar-customizer/emotion-converter";

interface ViewState {
    users: IServerUser[],
    editUser?: IServerUser,
    deleteUser?: IServerUser,
}

export const Options = () => {
    const [view, setView ] = useState<ViewState>({
        users: []
    });

    useEffect(() => {
        console.log('useEffect')
        storage.getUsers()
            .then(updateView)
    }, []);


    async function updateView(){
        const users = await storage.getUsers();
        setView({
            users,
            editUser: undefined,
            deleteUser: undefined
        });
    }

    async function clear(){
        await storage.clearApp();
        updateView();
    }

    async function addUser() {
        console.log("addUser");
        await storage.addUser()
        updateView();

    }

    function onCloseEditor() {
        setView({
            ...view,
            editUser: undefined
        })
    }

    function onConfirmedRemoveUser(userId: string){
        storage.deleteUser(userId)
            .then(updateView);
    }

    function removeUser(user: IServerUser){
        console.log("removeUser", user);
        setView({
            ...view,
            deleteUser: user
        })
    }

    function onDeleteBtnMouseEvent(event:React.MouseEvent<HTMLElement>){
        if(event.type === "mouseenter"){
            setView({
                ...view,
                deleteUser: {
                    ...view.deleteUser,
                    avatar: withEmotion(view.editUser.avatar, Emotion.SAD)
                }
            })
        } else {
            setView({
                ...view,
                deleteUser: {
                    ...view.editUser
                }
            })
        }
    }

    function onUndoDeleteBtnMouseEvent(event:React.MouseEvent<HTMLElement>){
        if(event.type === "mouseenter"){
            setView({
                ...view,
                deleteUser: {
                    ...view.deleteUser,
                    avatar: withEmotion(view.editUser.avatar, Emotion.HAPPY)
                }
            })
        } else {
            setView({
                ...view,
                deleteUser: {
                    ...view.editUser
                }
            })
        }
    }

    function onUpdateUser(editedUser: IServerUser){
        console.log("onUpdateUser", editedUser);
        const index = view.users.findIndex(({ id }) => view.editUser.id === id);
        view.users[index] = editedUser;

        setView({
            ...view,
            editUser: undefined
        });
        server.setData(view)
            .then(updateView);
    }
    
    const userListClasses = classNames({
        [styles.userList]: true,
        [styles.isDisabled]: !!view.editUser
    });

    return(
        <div className={styles.container}>
            <ul className={userListClasses}>
                {view.users.map(user => {
                    const userListItemClasses = classNames({
                        [styles.userListItem]: true
                    });
                    return (
                        <li className={userListItemClasses}>
                            <button className={styles.avatarButton} disabled={!!view.editUser} onClick={() =>
                                        setView({
                                            ...view,
                                            editUser: user
                                        })
                            }>
                                <AvatarRevealer
                                    attributes={timeMachine(user.avatar)}
                                />
                            </button>
                            <h2 className={styles.name}>{user.name}</h2>
                        </li>
                    )
                })}
            </ul>

            <button onClick={clear}>Clear app</button>

            {!view.editUser && <button className={styles.addUserButton} onClick={addUser}>
                <Plus color={'white'} size={50}/>
                <span className={a11y.hidden}>Lägg till användare</span>
            </button>}
            {view.editUser && <Editor user={view.editUser} onCancel={onCloseEditor} onSave={onUpdateUser} onDelete={removeUser} />}
            {view.deleteUser && <div className={styles.prompt}>
                <h1>Är du säker du vill radera {view.deleteUser.name} och all hens historik</h1>
                <Avatar
                    avatarStyle='transparent'
                    {...view.deleteUser.avatar}
                />
                <ul>
                    <li>
                        <button className={styles.promptBtn} onMouseEnter={onDeleteBtnMouseEvent} onMouseLeave={onDeleteBtnMouseEvent} onClick={() => {
                            onConfirmedRemoveUser(view.deleteUser.id)
                        }}>Ja</button>
                    </li>
                    <li>
                        <button className={styles.promptBtn} onMouseEnter={onUndoDeleteBtnMouseEvent} onMouseLeave={onUndoDeleteBtnMouseEvent} onClick={() => {
                            setView({
                                ...view,
                                deleteUser: undefined
                            })
                        }}>Nej</button>
                    </li>
                </ul>
            </div>}
        </div>

    )
};
