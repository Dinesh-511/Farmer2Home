import { cropService } from '../api/crops.js';

export const addCropView = {
    template: `
        <div class="soil-plants-bottom" style="min-height: calc(100vh - 80px); display: flex; align-items: center; justify-content: center; padding: 2rem; position: relative; z-index: 1;">
            <div style="width: 100%; max-width: 560px; position: relative; z-index: 2;">

                <div class="card" style="position: relative; z-index: 2;">
                    <div class="auth-header">
                         <h2>Add New Harvest</h2>
                         <p>List your crop for sale in the marketplace.</p>
                    </div>
                    <form id="add-crop-form">
                        <div class="form-group" style="margin-bottom: 1.25rem;">
                            <label style="display:block; font-weight:600; margin-bottom:0.5rem; color: var(--text-dark);">Crop Name</label>
                            <input type="text" id="cropName" placeholder="e.g., Basmati Rice, Fresh Carrots" required
                                style="width:100%; padding:0.75rem 1rem; border:1px solid #ddd; border-radius:8px; font-size:1rem; font-family:inherit; box-sizing:border-box; position:relative; z-index:5;"
                            >
                        </div>
                        <div class="form-group" style="margin-bottom: 1.25rem;">
                            <label style="display:block; font-weight:600; margin-bottom:0.5rem; color: var(--text-dark);">Category</label>
                            <select id="category" required
                                style="width:100%; padding:0.75rem 1rem; border:1px solid #ddd; border-radius:8px; font-size:1rem; font-family:inherit; box-sizing:border-box; position:relative; z-index:5; background:white;">
                                <option value="Vegetable">Vegetable (Expires in 4 days)</option>
                                <option value="Fruit">Fruit (Expires in 4 days)</option>
                                <option value="Rice">Rice (Expires in 30 days)</option>
                            </select>
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.25rem;">
                            <div>
                                <label style="display:block; font-weight:600; margin-bottom:0.5rem; color: var(--text-dark);">Quantity</label>
                                <input type="number" id="quantity" placeholder="Units available" required min="1"
                                    style="width:100%; padding:0.75rem 1rem; border:1px solid #ddd; border-radius:8px; font-size:1rem; font-family:inherit; box-sizing:border-box; position:relative; z-index:5;"
                                >
                            </div>
                            <div>
                                <label style="display:block; font-weight:600; margin-bottom:0.5rem; color: var(--text-dark);">Price per Unit ($)</label>
                                <input type="number" id="price" placeholder="0.00" required min="0.01" step="0.01"
                                    style="width:100%; padding:0.75rem 1rem; border:1px solid #ddd; border-radius:8px; font-size:1rem; font-family:inherit; box-sizing:border-box; position:relative; z-index:5;"
                                >
                            </div>
                        </div>

                        <div style="display: flex; gap: 1rem;">
                            <button type="submit" class="btn-primary" style="flex: 1; position:relative; z-index:5;">List Crop</button>
                            <a href="#/dashboard" class="btn-secondary" style="text-decoration:none; text-align:center; position:relative; z-index:5;">Cancel</a>
                        </div>
                    </form>
                    <div id="msg" style="text-align:center; margin-top:1rem;"></div>
                </div>
            </div>
        </div>
    `,
    init: () => {
        const form = document.getElementById('add-crop-form');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const cropName = document.getElementById('cropName').value;
            const category = document.getElementById('category').value;
            const quantity = document.getElementById('quantity').value;
            const price = document.getElementById('price').value;
            const msg = document.getElementById('msg');

            try {
                await cropService.createCrop({ cropName, category, quantity, price });
                await window.notifier.alert('Your crop has been listed successfully!', 'success');
                window.location.hash = '#/dashboard';
            } catch (error) {
                window.notifier.showToast(error.message, 'error');
            }
        });
    }
};
