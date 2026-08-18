import React, { useEffect, useState } from "react";
import { ModalProps } from "@/types";
import { Button } from "./Button";
import { X } from "lucide-react";

/**
 * A Modal component that displays a popup dialog with customizable content and actions.
 * @param {boolean} isOpen - Controls the visibility of the modal
 * @param {React.ReactNode} icon - Icon element to display at the top of the modal
 * @param {string} iconStyle - Additional CSS classes for the icon container
 * @param {string} title - The title text of the modal
 * @param {string} message - The main content/message of the modal
 * @param {string} submitText - Text for the submit/confirm button
 * @param {Function} onSubmit - Handler for submit/confirm action
 * @param {string} cancelText - Text for the cancel button (optional)
 * @param {Function} onCancel - Handler for cancel action (optional)
 * @param {string} className - Additional CSS classes
 */
export const Modal = ({
  isOpen,
  icon,
  iconStyle,
  title,
  message,
  submitText,
  onSubmit,
  cancelText,
  onCancel,
  closeOnOverlayClick = true,
  isProcessing = false,
}: ModalProps) => {
  const ANIMATION_DURATION = 500; // ms, should match your CSS duration

  const [visible, setVisible] = useState(isOpen);
  const [animateOut, setAnimateOut] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      setAnimateOut(false);
      setAnimateIn(false);
      // Trigger animateIn after mount
      const tick = setTimeout(() => {
        setAnimateIn(true);
      }, 20); // 1 frame delay
      return () => clearTimeout(tick);
    } else if (visible) {
      setAnimateOut(true);
      setAnimateIn(false);
      const timeout = setTimeout(() => {
        setVisible(false);
        setAnimateOut(false);
      }, ANIMATION_DURATION);
      return () => clearTimeout(timeout);
    }
  }, [isOpen, visible]);

  // Handler for clicking outside the modal to close it
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && e.target === e.currentTarget && onCancel) {
      onCancel();
    }
  };

  // Early return if modal should not be shown
  if (!visible) return null;

  // if (!isOpen) return null;

  return (
    // Overlay backdrop with click-outside handling
    <div
      className={`modal-overlay ${animateIn && !animateOut ? "opacity-100" : "opacity-0"}`}
      role="dialog"
      tabIndex={-1}
      onClick={handleOverlayClick}
    >
      <div
        className={`modal-wrapper ${animateIn && !animateOut ? "mt-7 opacity-100" : "opacity-0"}`}
      >
        {/* Modal content */}
        <div className="modal-content">
          {onCancel && (
            <div>
              <button
                type="button"
                onClick={onCancel}
                className="modal_close-button"
                aria-label="Close"
              >
                <span className="sr-only">Close</span>
                <X className="icon" />
              </button>
            </div>
          )}

          <div className="modal-content_container">
            <div className="modal-content_container-body">
              {/* Icon section */}
              <span className={`modal-content_icon-wrapper ${iconStyle}`}>
                {icon}
              </span>
              {/* Title section */}
              <h3 className="modal-content_title">{title}</h3>
              {/* Message section */}
              {typeof message === "string" ? <p>{message}</p> : message}
            </div>
          </div>

          {/* Modal footer with action buttons */}
          <div className="modal-content_button-wrapper">
            {/* Submit/confirm button */}
            {submitText && onSubmit && (
              <Button
                text={submitText}
                onClick={onSubmit}
                disabled={isProcessing}
              />
            )}

            {/* Optional cancel button */}
            {cancelText && onCancel && (
              <Button
                text={cancelText}
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isProcessing}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
