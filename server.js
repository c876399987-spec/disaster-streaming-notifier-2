const express = require('express');
const app = express();
app.use(express.json());

// 記憶體暫存器，模擬大數據整合（公共資料流設計）
const memoryDatabase = {};

app.post('/api/report/stream', (req, res) => {
    const { report_id, sequence, timestamp, status, location, payload } = req.body;

    if (!report_id || !sequence || !status || !location) {
        return res.status(400).json({ status: "ERROR", message: "規格不符 JSON Schema 規範" });
    }

    // 碎形資料 UPSERT 聚合邏輯
    if (!memoryDatabase[report_id]) {
        memoryDatabase[report_id] = {
            report_id: report_id,
            initial_timestamp: timestamp,
            latest_update: timestamp,
            latest_status: status,
            latitude: location.latitude,
            longitude: location.longitude,
            accumulated_intel: {}
        };
    } else {
        memoryDatabase[report_id].latest_status = status;
        memoryDatabase[report_id].latest_update = timestamp;
    }

    if (payload && Object.keys(payload).length > 0) {
        Object.assign(memoryDatabase[report_id].accumulated_intel, payload);
    }

    // 標準化輸出規格 (Output)
    return res.status(200).json({
        status: "SUCCESS",
        server_ack_timestamp: Math.floor(Date.now() / 1000),
        processed_sequence: sequence,
        registered_id: report_id,
        current_snapshot: memoryDatabase[report_id]
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`防災後端模擬微服務運作於 Port ${PORT}`));
