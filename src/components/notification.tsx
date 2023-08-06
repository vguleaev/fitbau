import React from 'react';
import { Toaster } from 'react-hot-toast';
import styles from '../styles/notification.module.scss';

export default function Notification() {
  return <Toaster position="top-center" reverseOrder={false} toastOptions={{ className: styles.toast }} />;
}
