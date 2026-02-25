export const reviewView = {
    template: `
        <div style="min-height: calc(100vh - 80px); display: flex; align-items: center; justify-content: center; background: var(--bg-light);">
            <div class="card animate-enter" style="width: 100%; max-width: 480px; padding: 2.5rem;">
                <h2 style="margin-bottom: 0.25rem; color: var(--primary-dark);">Leave a Review</h2>
                <p style="color: var(--text-light); margin-bottom: 2rem; font-size: 0.9rem;">Share your experience with this crop</p>

                <form id="review-form">
                    <!-- Star Rating Selector -->
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display:block; font-weight: 600; margin-bottom: 0.5rem; color: var(--text-dark);">Rating</label>
                        <div id="star-selector" style="display: flex; gap: 0.5rem; font-size: 2rem; cursor: pointer;">
                            <span class="star" data-value="1" style="color: #ccc; transition: color 0.2s;">★</span>
                            <span class="star" data-value="2" style="color: #ccc; transition: color 0.2s;">★</span>
                            <span class="star" data-value="3" style="color: #ccc; transition: color 0.2s;">★</span>
                            <span class="star" data-value="4" style="color: #ccc; transition: color 0.2s;">★</span>
                            <span class="star" data-value="5" style="color: #ccc; transition: color 0.2s;">★</span>
                        </div>
                        <input type="hidden" id="rating-val" value="0" />
                        <p id="rating-error" style="color: var(--danger); font-size: 0.8rem; display: none; margin-top: 0.25rem;">Please select a rating.</p>
                    </div>

                    <!-- Comment Input -->
                    <div style="margin-bottom: 1.5rem;">
                        <label for="comment" style="display:block; font-weight: 600; margin-bottom: 0.5rem; color: var(--text-dark);">Your Review</label>
                        <textarea id="comment" rows="4" placeholder="Tell others about the quality, freshness, etc." style="
                            width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 8px;
                            font-family: inherit; font-size: 0.95rem; resize: vertical; box-sizing: border-box;
                            transition: border-color 0.2s;
                        " onfocus="this.style.borderColor='var(--primary-color)'" onblur="this.style.borderColor='#ddd'"></textarea>
                    </div>

                    <div id="review-error" style="color: var(--danger); font-size: 0.85rem; margin-bottom: 1rem; display:none;"></div>

                    <button type="submit" class="btn-primary" style="width: 100%;">Submit Review</button>
                    <a href="#/dashboard" style="display:block; text-align:center; margin-top:1rem; color:var(--text-light); font-size:0.9rem; text-decoration:none;">← Back to Dashboard</a>
                </form>
            </div>
        </div>
    `,
    init: () => {
        // Extract cropId from URL hash: #/review/CROPID
        const hash = window.location.hash; // e.g., #/review/abc123
        const cropId = hash.split('/')[2];

        if (!cropId) {
            window.location.hash = '#/dashboard';
            return;
        }

        // Star rating interaction
        const stars = document.querySelectorAll('#star-selector .star');
        const ratingInput = document.getElementById('rating-val');

        const highlightStars = (value) => {
            stars.forEach(star => {
                star.style.color = parseInt(star.getAttribute('data-value')) <= value ? '#ffc107' : '#ccc';
            });
        };

        stars.forEach(star => {
            star.addEventListener('mouseover', () => highlightStars(parseInt(star.getAttribute('data-value'))));
            star.addEventListener('mouseout', () => highlightStars(parseInt(ratingInput.value)));
            star.addEventListener('click', () => {
                const val = parseInt(star.getAttribute('data-value'));
                ratingInput.value = val;
                highlightStars(val);
                document.getElementById('rating-error').style.display = 'none';
            });
        });

        // Form submission
        document.getElementById('review-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const rating = parseInt(ratingInput.value);
            const comment = document.getElementById('comment').value.trim();
            const errorEl = document.getElementById('review-error');
            const ratingError = document.getElementById('rating-error');

            errorEl.style.display = 'none';

            if (rating < 1 || rating > 5) {
                ratingError.style.display = 'block';
                return;
            }
            if (!comment) {
                errorEl.textContent = 'Please write a comment before submitting.';
                errorEl.style.display = 'block';
                return;
            }

            try {
                await window.reviewService.createReview({ cropId, rating, comment });
                window.notifier.showToast('Thank you for your review!');
                window.location.hash = '#/dashboard';
            } catch (err) {
                errorEl.textContent = err.message || 'Failed to submit review. Please try again.';
                errorEl.style.display = 'block';
            }
        });
    }
};
