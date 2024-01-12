async function submitReset(userId) {
    const newPassword = document.getElementById('newPassword').value;
    try {
        const response = await fetch(`http://localhost:2303/api/v1/reset/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password: newPassword }),
        });

        if (response.ok) {
            // Password reset successful, you can redirect the user or show a success message
            console.log('Password reset successful');
        } else {
            // Password reset failed, handle the error
            console.error('Password reset failed:', response.statusText);
        }
    } catch (error) {
        console.error('An error occurred during password reset:', error.message);
    }
}

function getUserIdFromURL() {
    // Get the current path from the URL (e.g., "/api/v1/reset/65959d78f3fb74ed1b0e8fe9")
    const currentPath = window.location.pathname;

    // Use a regular expression to extract the user ID from the end of the path
    const match = currentPath.match(/\/reset\/([^\/]+)$/);

    if (match && match[1]) {
        // Return the extracted user ID
        return match[1];
    } else {
        // Handle the case when the user ID cannot be extracted
        console.error('Unable to extract user ID from the URL');
        return null; // or return a default value or handle the error accordingly
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Ensure the DOM is fully loaded before attaching the event listener
    const submitBtn = document.getElementById('submitBtn');

    if (submitBtn) {
        submitBtn.addEventListener('click', async () => {
            const userId = getUserIdFromURL(); // Implement this function to extract the user ID from the URL
            await submitReset(userId);
        });
    }
});
