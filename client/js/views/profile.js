export const profileView = {
    template: `
        <div class="profile-page-wrapper" style="box-sizing: border-box; height: 100vh; background: #fdfaf7; padding-top: 80px; overflow: hidden; display: flex; justify-content: center; align-items: center;">
            <div class="container" style="max-width: 1200px; width: 100%; height: calc(100vh - 100px); display: flex; flex-direction: column; overflow: hidden;">
                
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 1.5rem; flex-shrink: 0; padding: 0 1rem;">
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <a href="#/dashboard" class="btn-dashboard-back" style="text-decoration: none; display: flex; align-items: center; gap: 0.6rem; background: #ffffff; padding: 0.4rem 1rem; border-radius: 50px; border: 1px solid #e0e0e0; font-weight: 700; color: #1b3022; font-size: 0.85rem; box-shadow: 0 2px 5px rgba(0,0,0,0.05); transition: all 0.2s ease; position: relative; z-index: 10;">
                            <div style="background: #2196f3; width: 24px; height: 24px; border-radius: 6px; display: flex; align-items: center; justify-content: center; color: white;">
                                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                            </div>
                            DASHBOARD
                        </a>
                        <span style="color: #666; font-weight: 600; font-size: 1rem;">My Profile</span>
                    </div>
                </div>

                <div class="profile-grid" style="display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: minmax(0, 1fr); gap: 2rem; flex: 1; min-height: 0; padding-bottom: 2rem; overflow: hidden;">
                    
                    <!-- Left Page: Profile Details -->
                    <div class="card animate-enter" style="min-height: 0; padding: 2rem; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.04); display: flex; flex-direction: column; overflow-y: auto;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 2rem; flex-shrink: 0;">
                            <h3 style="margin: 0; color: #1b3022; font-family: var(--font-serif); font-size: 1.5rem;">Profile Details</h3>
                            <button id="edit-btn" class="btn-secondary" style="border-radius: 50px; padding: 0.5rem 1.4rem; font-weight: 700; font-size: 0.8rem; text-transform: uppercase; border: 1.5px solid #1b3022; color: #1b3022; cursor: pointer; position: relative; z-index: 10;">EDIT PROFILE</button>
                            <button id="cancel-btn" class="btn-secondary" style="display:none; border-radius: 50px; padding: 0.5rem 1.4rem; font-weight: 700; font-size: 0.8rem; text-transform: uppercase; background: #9e9e9e; color: white; border: none;">CANCEL</button>
                        </div>

                        <form id="profile-form" style="flex: 1; display: flex; flex-direction: column;">
                            <div style="text-align: center; margin-bottom: 2rem; flex-shrink: 0;">
                                <div style="width: 100px; height: 100px; background: #f0f0f0; border-radius: 50%; margin: 0 auto 1rem; display: flex; align-items: center; justify-content: center; overflow: hidden; position: relative; border: 3px solid #fff; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                                    <img id="profile-img-preview" src="" alt="Profile" style="width: 100%; height: 100%; object-fit: cover; display: none;">
                                    <span id="profile-placeholder" style="font-size: 3rem; color: #ccc;">👤</span>
                                </div>
                                <h3 id="display-name" style="margin: 0; font-family: var(--font-serif); font-size: 1.6rem; color: #1b3022;">Loading...</h3>
                                <p id="display-role" style="color: #2e7d32; text-transform: uppercase; margin: 0.3rem 0; font-weight: 700; font-size: 0.8rem; letter-spacing: 1px;">...</p>
                            </div>

                            <div class="grid" style="grid-template-columns: 1fr; gap: 1.2rem; flex-shrink: 0;">
                                <div class="form-group" style="margin-bottom: 0;">
                                    <label style="font-weight: 700; font-size: 0.8rem; color: #333; margin-bottom: 0.3rem;">Name</label>
                                    <input type="text" id="name" disabled required style="padding: 0.7rem 1rem; border-radius: 10px; border: 1px solid #eee; background: #fdfdfd; font-size: 0.9rem;">
                                </div>

                                <div class="form-group" style="margin-bottom: 0;">
                                    <label style="font-weight: 700; font-size: 0.8rem; color: #333; margin-bottom: 0.3rem;">Email</label>
                                    <input type="email" id="email" disabled required style="padding: 0.7rem 1rem; border-radius: 10px; border: 1px solid #eee; background: #fdfdfd; opacity: 0.7; font-size: 0.9rem;">
                                </div>

                                <div class="form-group" style="margin-bottom: 0;">
                                    <label style="font-weight: 700; font-size: 0.8rem; color: #333; margin-bottom: 0.3rem;">Phone</label>
                                    <input type="text" id="phone" disabled placeholder="Enter phone number" style="padding: 0.7rem 1rem; border-radius: 10px; border: 1px solid #eee; background: #fdfdfd; font-size: 0.9rem;">
                                </div>

                                <div class="form-group" style="margin-bottom: 0;">
                                    <label style="font-weight: 700; font-size: 0.8rem; color: #333; margin-bottom: 0.3rem;">Address</label>
                                    <textarea id="address" disabled placeholder="Enter your address" style="padding: 0.7rem 1rem; border-radius: 10px; border: 1px solid #eee; background: #fdfdfd; min-height: 80px; font-size: 0.9rem;"></textarea>
                                </div>
                            </div>

                            <div id="farmer-fields" style="display: none; border-top: 1px solid #eee; margin-top: 1.5rem; padding-top: 1.5rem; flex-shrink: 0;">
                                <h3 style="margin-bottom: 1.2rem; font-family: var(--font-serif); font-size: 1.3rem;">Farm Details</h3>
                                <div class="grid" style="grid-template-columns: 1fr; gap: 1.2rem;">
                                    <div class="form-group" style="margin-bottom: 0;">
                                        <label style="font-weight: 700; font-size: 0.8rem; color: #333; margin-bottom: 0.3rem;">Farm Name</label>
                                        <input type="text" id="farmName" disabled placeholder="e.g. Green Valley Farm" style="padding: 0.7rem 1rem; border-radius: 10px; border: 1px solid #eee; background: #fdfdfd; font-size: 0.9rem;">
                                    </div>
                                    <div class="form-group" style="margin-bottom: 0;">
                                        <label style="font-weight: 700; font-size: 0.8rem; color: #333; margin-bottom: 0.3rem;">Farm Location</label>
                                        <input type="text" id="farmLocation" disabled placeholder="City, State" style="padding: 0.7rem 1rem; border-radius: 10px; border: 1px solid #eee; background: #fdfdfd; font-size: 0.9rem;">
                                    </div>
                                    <div class="form-group" style="margin-bottom: 0;">
                                        <label style="font-weight: 700; font-size: 0.8rem; color: #333; margin-bottom: 0.3rem;">Description</label>
                                        <textarea id="farmDescription" disabled placeholder="Tell us about your farm..." style="padding: 0.7rem 1rem; border-radius: 10px; border: 1px solid #eee; background: #fdfdfd; min-height: 80px; font-size: 0.9rem;"></textarea>
                                    </div>
                                </div>
                            </div>

                            <!-- Spacer to push save button to bottom if needed -->
                            <div style="flex-grow: 1;"></div> 

                            <div id="edit-actions" style="margin-top: 2rem; display: none; flex-shrink: 0;">
                                <button type="submit" class="btn-primary" style="width: 100%; border-radius: 50px; padding: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; font-size: 0.9rem;">SAVE CHANGES</button>
                            </div>
                        </form>
                    </div>

                    <!-- Right Page: Password Change Section -->
                    <div class="card animate-enter delay-100" style="min-height: 0; padding: 2rem; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.04); display: flex; flex-direction: column; overflow-y: auto;">
                        <h3 style="margin-bottom: 2rem; color: #2e7d32; font-family: var(--font-serif); font-size: 1.5rem; flex-shrink: 0;">Change Password</h3>
                        <form id="password-form" style="flex: 1; display: flex; flex-direction: column;">
                            <div class="grid" style="grid-template-columns: 1fr; gap: 1.5rem; flex-shrink: 0;">
                                <div class="form-group" style="margin-bottom: 0;">
                                    <label style="font-weight: 700; font-size: 0.85rem; color: #333; margin-bottom: 0.4rem;">Current Password</label>
                                    <input type="password" id="oldPassword" required style="padding: 0.8rem 1rem; border-radius: 10px; border: 1px solid #eee; background: #fdfdfd; font-size: 0.9rem;">
                                </div>
                                <div class="form-group" style="margin-bottom: 0;">
                                    <label style="font-weight: 700; font-size: 0.85rem; color: #333; margin-bottom: 0.4rem;">New Password</label>
                                    <input type="password" id="newPassword" required style="padding: 0.8rem 1rem; border-radius: 10px; border: 1px solid #eee; background: #fdfdfd; font-size: 0.9rem;">
                                </div>
                            </div>
                            
                            <!-- Spacer -->
                            <div style="flex-grow: 1;"></div>

                            <button type="submit" class="btn-secondary" style="width: 100%; margin-top: 2rem; border-radius: 50px; padding: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; border: 1.5px solid #1b3022; color: #1b3022; font-size: 0.9rem; flex-shrink: 0;">UPDATE PASSWORD</button>
                        </form>
                    </div>
                    
                </div>
            </div>
        </div>
        
        <style>
            @media (max-width: 768px) {
                .profile-page-wrapper .profile-grid {
                    grid-template-columns: 1fr;
                    grid-template-rows: auto;
                    height: auto;
                    overflow-y: visible;
                }
                .profile-page-wrapper .container {
                    height: auto;
                    overflow: visible;
                }
            }
        </style>
    `,
    init: async () => {

        const user = window.authService.getCurrentUser();
        if (!user) {

            window.location.hash = '#/login';
            return;
        }

        const form = document.getElementById('profile-form');
        const passForm = document.getElementById('password-form');
        const editBtn = document.getElementById('edit-btn');
        const cancelBtn = document.getElementById('cancel-btn');
        const editActions = document.getElementById('edit-actions');

        if (!form || !editBtn) {
            console.error('[DEBUG] Required DOM elements not found in profileView');
            return;
        }

        const inputs = form.querySelectorAll('input, textarea');

        // Load Profile Data
        try {

            const profile = await window.userService.getProfile();


            // Populate Fields
            document.getElementById('name').value = profile.name || '';
            document.getElementById('email').value = profile.email || '';
            document.getElementById('phone').value = profile.phone || '';
            document.getElementById('address').value = profile.address || '';
            document.getElementById('display-name').innerText = profile.name;
            document.getElementById('display-role').innerText = profile.role;

            if (profile.profileImage) {
                document.getElementById('profile-img-preview').src = profile.profileImage;
                document.getElementById('profile-img-preview').style.display = 'block';
                document.getElementById('profile-placeholder').style.display = 'none';
            }

            // Farmer Fields population
            if (user.role === 'farmer') {
                document.getElementById('farmer-fields').style.display = 'block';
                document.getElementById('farmName').value = profile.farmName || '';
                document.getElementById('farmLocation').value = profile.farmLocation || '';
                document.getElementById('farmDescription').value = profile.farmDescription || '';
            }

        } catch (error) {
            console.error('[DEBUG] Failed to load profile:', error);
            window.notifier.showToast('Failed to load profile: ' + error.message, 'error');
        }

        // Edit Mode Toggle
        let isEditing = false;

        editBtn.addEventListener('click', () => {

            isEditing = true;
            toggleEditMode(true);
        });

        cancelBtn.addEventListener('click', () => {

            isEditing = false;
            toggleEditMode(false);
            profileView.init(); // Reload original data
        });

        function toggleEditMode(enabled) {

            inputs.forEach(input => {
                if (input.id !== 'email') { // Email usually read-only
                    input.disabled = !enabled;
                    // Apply visual feedback for enabled state
                    input.style.borderColor = enabled ? '#2e7d32' : '#eee';
                    input.style.background = enabled ? '#fff' : '#fdfdfd';
                }
            });
            editBtn.style.display = enabled ? 'none' : 'block';
            cancelBtn.style.display = enabled ? 'block' : 'none';
            editActions.style.display = enabled ? 'block' : 'none';
        }

        // Handle Profile Update
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const updatedData = {
                name: document.getElementById('name').value,
                phone: document.getElementById('phone').value,
                address: document.getElementById('address').value,
            };

            if (user.role === 'farmer') {
                updatedData.farmName = document.getElementById('farmName').value;
                updatedData.farmLocation = document.getElementById('farmLocation').value;
                updatedData.farmDescription = document.getElementById('farmDescription').value;
            }

            try {
                const res = await window.userService.updateProfile(updatedData);

                window.notifier.showToast('Profile updated successfully!');

                // Update local user info if name changed
                const currentUser = JSON.parse(localStorage.getItem('user'));
                if (currentUser) {
                    currentUser.name = res.name;
                    localStorage.setItem('user', JSON.stringify(currentUser));
                }

                toggleEditMode(false);
                profileView.init(); // Refresh
            } catch (error) {
                console.error('[DEBUG] Profile update failed:', error);
                window.notifier.showToast(error.message, 'error');
            }
        });

        // Handle Password Change
        passForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const oldPassword = document.getElementById('oldPassword').value;
            const newPassword = document.getElementById('newPassword').value;

            try {
                await window.userService.changePassword({ oldPassword, newPassword });

                window.notifier.showToast('Password updated successfully');
                passForm.reset();
            } catch (error) {
                console.error('[DEBUG] Password change failed:', error);
                window.notifier.showToast(error.message, 'error');
            }
        });
    }
};
