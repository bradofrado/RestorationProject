import React, { useState } from "react";
import Button, { type ButtonProps } from "./button"
import Modal, { ButtonInfo } from "../modal";

type ConfirmButtonPropsInner = {
    onConfirm: () => void,
    onCancel?: () => void
    header: string,
    message: string
}
type ConfirmButtonProps<C extends React.ElementType> = ButtonProps<C> & ConfirmButtonPropsInner;
const ConfirmButton = <C extends React.ElementType>(props: ConfirmButtonProps<C>) => {
    const [isOpen, setIsOpen] = useState(false);
    const {onConfirm, onCancel, message, header} = props;

    const onButtonClick = () => {
        setIsOpen(true);
    }
    const onCancelClick = () => {
        setIsOpen(false);
        onCancel && onCancel();
    }
    const onOk = () => {
        setIsOpen(false);
        onConfirm();
    }

    const buttons: ButtonInfo[] = [
        {
            mode: 'secondary',
            label: 'Cancel',
            handler: onCancelClick
        },
        {
            mode: 'primary',
            label: 'Confirm',
            handler: onOk
        }
    ]

    return <>
        <Button {...props} onClick={onButtonClick} />
        <Modal isOpen={isOpen} header={header} buttons={buttons}>
            {message}
        </Modal>
    </>
}

export default ConfirmButton;