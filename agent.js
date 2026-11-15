const express = require('express');
const app = express();
app.use(express.json());

app.post('/agent', (req, res) => {
    try {
        const task = req.body;
        console.log(`Menerima task:`, task);

        const minBalance = task.minimumBalance || 1000;
        const currentBalance = task.publicBalance || 0;
        const proofVk = task.proofVk || "";
        
        let decision = "APPROVE";
        let reason = "Valid condition met";

        if (currentBalance < minBalance) {
            decision = "REJECT";
            reason = "THRESHOLD_MISMATCH";
        } else if (proofVk === "substituted" || proofVk.includes("substitute")) {
            decision = "REJECT";
            reason = "VK_SUBSTITUTION";
        } else if (task.recipientMismatch) {
            decision = "REJECT";
            reason = "RECIPIENT_MISMATCH";
        }

        res.json({
            decision: decision,
            reason: reason
        });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ decision: "REJECT", reason: "INTERNAL_ERROR" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Agent Games endpoint berjalan di port ${PORT}`);
});
