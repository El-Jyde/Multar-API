const resetHTML = (userId) => {

    return `
    
    <!DOCTYPE html>
<html lang="en">
<head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Reset</title>
        </head>
        <body>
            <h1>Password Reset</h1>
            <form id="resetForm">
                <label for="newPassword">New Password:</label>
                <input type="password" id="newPassword" name="newPassword" required>
                <button type="button" id="submitBtn">Submit</button>
            </form>
    <script src="./submitReset.js"></script>
</body>
</html>

    `
}

module.exports = resetHTML;