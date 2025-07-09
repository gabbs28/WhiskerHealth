import React, { createContext, useContext, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import './Modal.css';
import { Loader } from '../components/common/Loader.tsx';

interface IModalContextProps {
    value: string;
    updateValue: (newValue: string) => void;
    modalRef?: any;
    modalContent?: any;
    closeModal?: any;
    setModalContent?: any;
    setOnModalClose?: any;
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
}

interface IModalProviderProps {
    children: any;
}

const ModalContext = createContext<IModalContextProps>({
    value: '',
    updateValue: () => {},
    isLoading: false,
    setIsLoading: () => {},
});

export function ModalProvider({ children }: Readonly<IModalProviderProps>) {
    const modalRef = useRef<HTMLDivElement | null>(null);
    const [modalContent, setModalContent] = useState<React.ReactNode>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // callback function that will be called when modal is closing
    const [onModalClose, setOnModalClose] = useState<(() => void) | null>(null);

    const closeModal = () => {
        // Clear the modal's content
        setModalContent(null);

        // If callback function is function call it
        if (typeof onModalClose === 'function') {
            onModalClose();
        }

        // Reset callback if set
        if (onModalClose !== null) {
            setOnModalClose(null);
        }
    };

    const contextValue = useMemo(
        () =>
            ({
                modalRef, // reference to modal div
                modalContent, // React component to render inside modal
                setModalContent, // function to set the React component to render inside modal
                setOnModalClose, // function to set the callback function called when modal is closing
                closeModal, // function to close the modal
                isLoading, // if the modal is loading
                setIsLoading, // function to set the loading state of the modal
            }) as IModalContextProps,
        [modalContent, closeModal, isLoading],
    );

    return (
        <>
            <ModalContext.Provider value={contextValue}>{children}</ModalContext.Provider>
            <div ref={modalRef} />
        </>
    );
}

export function Modal() {
    const { modalRef, modalContent, closeModal, isLoading } = useContext(ModalContext);
    // If there is no div referenced by the modalRef or modalContent is not a
    // truthy value, render nothing:
    if (!modalRef?.current || !modalContent) {
        return null;
    }

    // Render the following component to the div referenced by the modalRef
    return ReactDOM.createPortal(
        <div id="modal">
            <div id="modal-background" onClick={closeModal} />
            <div id="modal-content">
                {modalContent}
                {isLoading && (
                    <div id="modal-loader">
                        <Loader />
                    </div>
                )}
            </div>
        </div>,
        modalRef.current,
    );
}

export const useModal = () => useContext(ModalContext);
