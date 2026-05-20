CREATE TABLE IF NOT EXISTS disaster_reports (
    report_id VARCHAR(50) PRIMARY KEY, -- 去識別化隨機 ID
    latest_status VARCHAR(50) NOT NULL, -- 目前最新狀態碼
    latitude NUMERIC(9, 6) NOT NULL, -- GIS 緯度
    longitude NUMERIC(9, 6) NOT NULL, -- GIS 經度
    accumulated_intel JSONB DEFAULT '{}'::jsonb, -- 碎形增量沙盒，用於儲存問答（相容跳過機制）
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_reports_gis ON disaster_reports (latitude, longitude);
