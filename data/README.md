# Dataset Information

## 📊 Files in This Repository

### `freshClass_DS_preprocessed.csv`
✅ **Included in this repo** (~1 MB)

- **Size:** ~1 MB
- **Rows:** 14,786 image records
- **Columns:**
  - `image_path`: Relative path to image (e.g., `resized_images/img_00001.jpg`)
  - `label`: Fruit quality label (e.g., `Apple_Good`, `Banana_Bad`)

## 🖼️ Images Folder

❌ **NOT included in Git** (70 MB total)

The actual fruit images are stored on **Google Drive** due to their size.

### 📥 Download Images

**Google Drive Link:** [ADD YOUR GOOGLE DRIVE LINK HERE]

Download the `resized_images` folder and place it in the project root directory.

### Expected Structure After Download:
```
fruit-quality-classifier/
├── data/
│   └── freshClass_DS_preprocessed.csv  ✅ (in repo)
└── resized_images/  ⬅️ Download here
    ├── img_00001.jpg
    ├── img_00002.jpg
    └── ... (14,786 images total)
```

## 🚀 Setup Instructions

### Option 1: Using Google Colab (Recommended)

All notebooks are configured to work with Google Colab:
```python
from google.colab import drive
drive.mount('/content/drive')

# Path to CSV (will be in your Drive)
csv_path = "/content/drive/MyDrive/ML_GEST_PR/freshClass_DS_preprocessed.csv"

# Path to images (will be in your Drive)
images_base = "/content/drive/MyDrive/ML_GEST_PR/"
```

### Option 2: Local Setup

1. **Clone this repository**
2. **Download images** from the Google Drive link above
3. **Place the `resized_images` folder in the project root**
4. **Update paths in notebooks:**
```python
import pandas as pd
import os

# Load CSV from repo
csv_path = "data/freshClass_DS_preprocessed.csv"
df = pd.read_csv(csv_path)

# Fix paths to point to local images
df['image_path'] = df['image_path'].apply(lambda x: x.replace('\\', '/'))
df['full_path'] = os.path.join(os.getcwd(), df['image_path'])

# Verify images exist
df = df[df['full_path'].apply(os.path.exists)].reset_index(drop=True)
print(f"✅ Found {len(df)} valid images")
```

## 📊 Dataset Statistics

- **Total Images:** 14,786
- **Number of Classes:** 12
- **Classes:**
  - Apple (Good/Bad)
  - Banana (Good/Bad)
  - Guava (Good/Bad)
  - Lime (Good/Bad)
  - Orange (Good/Bad)
  - Pomegranate (Good/Bad)
- **Image Size:** 128×128 pixels (RGB)
- **Format:** JPEG

### Class Distribution
Each fruit type has approximately:
- ~1,200 images per fruit type
- Balanced between Good and Bad quality

## 🔧 Preprocessing Details

**Preprocessing by:** Ines & Imen

**Steps performed:**
1. ✅ Image resizing to 128×128 pixels
2. ✅ Path normalization (backslash → forward slash)
3. ✅ Quality labeling (Good/Bad classification)
4. ✅ Image validation (existence check)
5. ✅ Metadata CSV generation with train/val/test consideration

**Original preprocessing code:** See `notebooks/01_data_preprocessing.ipynb`

## ✅ Verification

To verify your setup is correct:
```python
import os
import pandas as pd

# Load CSV
df = pd.read_csv("data/freshClass_DS_preprocessed.csv")
print(f"CSV rows: {len(df)}")

# Check if images folder exists
if os.path.exists("resized_images"):
    image_count = len([f for f in os.listdir("resized_images") if f.endswith('.jpg')])
    print(f"Images found: {image_count}")
    
    if image_count == 14786:
        print("✅ All images present!")
    else:
        print(f"⚠️ Expected 14,786 images, found {image_count}")
else:
    print("❌ resized_images folder not found. Please download from Google Drive.")
```

## 🆘 Troubleshooting

### "Images folder not found"
- Make sure you downloaded the `resized_images` folder from Google Drive
- Place it in the project root (same level as `data/` folder)

### "Some images are missing"
- Re-download the complete folder from Google Drive
- Ensure download completed successfully (70 MB total)

### "Path not found" errors in notebooks
- For Colab: Ensure Google Drive is mounted
- For Local: Ensure `resized_images/` is in project root
- Check that CSV column `image_path` matches actual folder structure

## 📞 Support

For dataset access or issues:
- Check the preprocessing notebook: `notebooks/01_data_preprocessing.ipynb`
- Contact: Ines or Imen (data preprocessing team)
- For Google Drive access, contact project maintainers
```

---

## 🎯 **What's Different/Added:**

### In `.gitignore`:
- ✅ Added individual image extensions (*.jpg, *.png)
- ✅ Allowed docs images (confusion matrix, etc.)

### In `data/README.md`:
- ✅ **Clear indication**: CSV is IN repo, images are NOT
- ✅ **Google Drive link placeholder** (you need to add your link)
- ✅ **Both setup options**: Colab + Local
- ✅ **Verification code**: To check setup is correct
- ✅ **Troubleshooting section**: Common issues
- ✅ **Statistics**: Class distribution info
- ✅ **Clear file structure** showing where to place images
- ✅ **Code examples** for both Colab and local setups

---

**Google Drive Link:** [Download resized_images folder]:
    https://drive.google.com/drive/folders/1IGc2yoqmyytN89ZmRiq4a1D0ZYYPAyTh?usp=sharing