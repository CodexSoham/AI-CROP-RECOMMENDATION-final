import unittest
from fastapi.testclient import TestClient
from backend.main import app
from backend.services.sentinel_hub_service import sentinel_hub_service

class TestFieldHealthAPI(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_demo_field_endpoint(self):
        res = self.client.get("/api/v1/field_health/demo_field")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue(data["success"])
        self.assertIn("current_health", data)
        self.assertIn("time_series", data)
        self.assertGreaterEqual(len(data["time_series"]), 10)
        self.assertIn("overlay", data)
        self.assertIn("ndvi_colormap_url", data["overlay"])
        self.assertTrue(data["cloud_filtering_applied"])

    def test_custom_polygon_endpoint(self):
        poly = {
            "type": "Polygon",
            "coordinates": [[
                [74.5802, 16.8510],
                [74.5855, 16.8510],
                [74.5855, 16.8562],
                [74.5802, 16.8562],
                [74.5802, 16.8510]
            ]]
        }
        payload = {
            "geojson": poly,
            "start_date": "2026-07-15",
            "end_date": "2026-09-15",
            "overlay_type": "ndvi"
        }
        res = self.client.post("/api/v1/field_health", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue(data["success"])
        
        # Verify classification rules
        mean_ndvi = data["current_health"]["mean_ndvi"]
        status = data["current_health"]["status"]
        if mean_ndvi < 0.2:
            self.assertEqual(status, "Bare Soil / Water")
        elif mean_ndvi < 0.5:
            self.assertEqual(status, "Low / Stressed Vegetation")
        elif mean_ndvi < 0.7:
            self.assertEqual(status, "Moderate Health")
        else:
            self.assertEqual(status, "Dense / Healthy Crop Canopy")

        # Verify time-series data
        for pt in data["time_series"]:
            self.assertIn("mean_ndvi", pt)
            self.assertIn("min_ndvi", pt)
            self.assertIn("max_ndvi", pt)
            self.assertIn("std_dev", pt)
            self.assertIn("valid_pixel_pct", pt)

    def test_classification_rubric(self):
        rubric_tests = [
            (0.12, "Bare Soil / Water", "bare_soil"),
            (0.35, "Low / Stressed Vegetation", "stressed"),
            (0.62, "Moderate Health", "moderate"),
            (0.78, "Dense / Healthy Crop Canopy", "healthy"),
        ]
        for val, expected_status, expected_key in rubric_tests:
            result = sentinel_hub_service.classify_vegetation_health(val, 0.04)
            self.assertEqual(result.status, expected_status)
            self.assertEqual(result.status_key, expected_key)

if __name__ == "__main__":
    unittest.main()
