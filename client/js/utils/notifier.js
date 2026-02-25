/**
 * Custom Notifier Utility
 * Replaces native alert() and confirm() with premium UI components.
 */

const notifier = {
    /**
     * Shows a transient toast message.
     * @param {string} message 
     * @param {'success' | 'error' | 'info'} type 
     */
    showToast: (message, type = 'success') => {
        const toast = document.createElement('div');
        const bgColor = type === 'error' ? 'var(--danger)' : type === 'info' ? '#333' : 'var(--primary-dark)';
        const icon = type === 'error' ? '❌' : type === 'info' ? 'ℹ️' : '✅';

        toast.innerHTML = `<span style="margin-right:0.75rem;">${icon}</span> ${message}`;
        toast.style.cssText = `
            position: fixed; bottom: 30px; right: 30px;
            background: ${bgColor}; color: white;
            padding: 1rem 1.5rem; border-radius: 12px;
            font-size: 0.95rem; font-weight: 600;
            z-index: 10000; box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            animation: slideInUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex; align-items: center;
        `;

        // Add keyframes if not present
        if (!document.getElementById('notifier-keyframes')) {
            const style = document.createElement('style');
            style.id = 'notifier-keyframes';
            style.innerHTML = `
                @keyframes slideInUp {
                    from { transform: translateY(100%) opacity: 0; }
                    to { transform: translateY(0) opacity: 1; }
                }
                @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
                @keyframes modalFadeIn {
                    from { background: rgba(0,0,0,0); opacity: 0; }
                    to { background: rgba(0,0,0,0.5); opacity: 1; }
                }
                @keyframes modalContentIn {
                    from { transform: scale(0.9); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.3s forwards';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    /**
     * Shows a custom alert modal (centered).
     * @param {string} message 
     * @param {'success' | 'error' | 'info'} type
     * @returns {Promise<void>}
     */
    alert: (message, type = 'success') => {
        return new Promise((resolve) => {
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: fixed; inset: 0; background: rgba(0,0,0,0.5);
                display: flex; align-items: center; justify-content: center;
                z-index: 11000; animation: modalFadeIn 0.2s ease;
                padding: 1.5rem;
            `;

            const modal = document.createElement('div');
            modal.style.cssText = `
                background: white; padding: 2.5rem; border-radius: 20px;
                width: 100%; max-width: 420px; box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                animation: modalContentIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                text-align: center;
            `;

            const icon = type === 'error' ? '❌' : type === 'info' ? 'ℹ️' : '✅';
            const title = type === 'error' ? 'Error' : type === 'info' ? 'Information' : 'Success!';

            modal.innerHTML = `
                <div style="font-size: 3.5rem; margin-bottom: 1rem;">${icon}</div>
                <h2 style="margin-bottom: 0.5rem; color: #1b5e20;">${title}</h2>
                <p style="color: #666; margin-bottom: 2rem; line-height: 1.6; font-size: 1.1rem;">${message}</p>
                <button id="notifier-ok" style="
                    width: 100%; padding: 0.8rem; border-radius: 12px;
                    border: none; background: var(--primary-dark); color: white;
                    cursor: pointer; font-weight: 600; font-family: inherit;
                    box-shadow: 0 4px 12px rgba(27, 94, 32, 0.3);
                    font-size: 1rem; transition: transform 0.2s;
                " onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">OK</button>
            `;

            overlay.appendChild(modal);
            document.body.appendChild(overlay);

            const cleanup = () => {
                overlay.style.animation = 'fadeOut 0.2s forwards';
                setTimeout(() => {
                    overlay.remove();
                    resolve();
                }, 200);
            };

            overlay.querySelector('#notifier-ok').addEventListener('click', cleanup);

            const handleEscape = (e) => {
                if (e.key === 'Escape') {
                    cleanup();
                    window.removeEventListener('keydown', handleEscape);
                }
            };
            window.addEventListener('keydown', handleEscape);
        });
    },

    /**
     * Shows a custom confirmation modal.
     * @param {string} message 
     * @returns {Promise<boolean>}
     */
    confirm: (message) => {
        return new Promise((resolve) => {
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: fixed; inset: 0; background: rgba(0,0,0,0.5);
                display: flex; align-items: center; justify-content: center;
                z-index: 11000; animation: modalFadeIn 0.2s ease;
                padding: 1.5rem;
            `;

            const modal = document.createElement('div');
            modal.style.cssText = `
                background: white; padding: 2.5rem; border-radius: 20px;
                width: 100%; max-width: 420px; box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                animation: modalContentIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                text-align: center;
            `;

            modal.innerHTML = `
                <div style="font-size: 3rem; margin-bottom: 1.5rem;">❓</div>
                <h3 style="margin-bottom: 1rem; color: #1b5e20;">Confirm Action</h3>
                <p style="color: #666; margin-bottom: 2rem; line-height: 1.6;">${message}</p>
                <div style="display: flex; gap: 1rem;">
                    <button id="notifier-cancel" style="
                        flex: 1; padding: 0.8rem; border-radius: 12px;
                        border: 1px solid #ddd; background: white; cursor: pointer;
                        font-weight: 600; font-family: inherit;
                    ">Cancel</button>
                    <button id="notifier-confirm" style="
                        flex: 1; padding: 0.8rem; border-radius: 12px;
                        border: none; background: var(--primary-dark); color: white;
                        cursor: pointer; font-weight: 600; font-family: inherit;
                        box-shadow: 0 4px 12px rgba(27, 94, 32, 0.3);
                    ">Confirm</button>
                </div>
            `;

            overlay.appendChild(modal);
            document.body.appendChild(overlay);

            const cleanup = () => {
                overlay.style.animation = 'fadeOut 0.2s forwards';
                setTimeout(() => overlay.remove(), 200);
            };

            overlay.querySelector('#notifier-confirm').addEventListener('click', () => {
                cleanup();
                resolve(true);
            });

            overlay.querySelector('#notifier-cancel').addEventListener('click', () => {
                cleanup();
                resolve(false);
            });

            // Handle Escape key
            const handleEscape = (e) => {
                if (e.key === 'Escape') {
                    cleanup();
                    window.removeEventListener('keydown', handleEscape);
                    resolve(false);
                }
            };
            window.addEventListener('keydown', handleEscape);
        });
    }
};

window.notifier = notifier;
export default notifier;
