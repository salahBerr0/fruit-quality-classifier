# 🖼️ Fruit Images Folder

⚠️ **Images are NOT included in this Git repository due to size (70MB total).**

## 📥 Download Images

Download the complete `resized_images` folder from Google Drive:

**[📁 Download from Google Drive](https://drive.google.com/drive/folders/1IGc2yoqmyytN89ZmRiq4a1D0ZYYPAyTh?usp=sharing)**

## 📂 What You'll Get

After downloading, you should have **14,786 fruit images**:
- Format: `.jpg`
- Size: 128×128 pixels each
- Total size: ~70 MB

## 🗂️ Folder Structure
```
resized_images/
├── README.md (this file)
├── img_00001.jpg
├── img_00002.jpg
├── img_00003.jpg
├── ...
└── img_14786.jpg
```

## 🚀 Setup Instructions

### For Google Colab Users (Recommended)
✅ **No download needed!** Just mount your Google Drive:
```python
from google.colab import drive
drive.mount('/content/drive')

# Images automatically accessible at:
# /content/drive/MyDrive/ML_GEST_PR/resized_images/
```

### For Local Development
1. **Click the Google Drive link above**
2. **Download the entire `resized_images` folder**
3. **Extract/place it in your project root:**
```
   fruit-quality-classifier/
   ├── data/
   ├── notebooks/
   └── resized_images/  ⬅️ Place downloaded folder here
       ├── img_00001.jpg
       └── ...
```

## ✅ Verify Your Setup

Run this code to verify everything is correct:
```python
import os

# Check if folder exists
if os.path.exists('resized_images'):
    # Count images
    images = [f for f in os.listdir('resized_images') if f.endswith('.jpg')]
    print(f"✅ Found {len(images)} images")
    
    if len(images) == 14786:
        print("✅ All images present!")
    else:
        print(f"⚠️ Expected 14,786 images, but found {len(images)}")
else:
    print("❌ Folder not found. Please download from Google Drive.")
```

## 📊 Dataset Contents



- **Apple:** Good/Bad quality images
- **Banana:** Good/Bad quality images
- **Guava:** Good/Bad quality images
- **Lime:** Good/Bad quality images
- **Orange:** Good/Bad quality images
- **Pomegranate:** Good/Bad quality images

**Total:** 12 classes (6 fruits × 2 quality levels)

## 🆘 Troubleshooting

### Can't access Google Drive link?
- Make sure you have the link (should be publicly accessible)
- Contact project maintainers for access

### Download incomplete?
- Folder should be exactly 70 MB
- Should contain 14,786 .jpg files
- Re-download if incomplete

### Images not loading in notebooks?
- **Colab:** Ensure Drive is mounted with `drive.mount('/content/drive')`
- **Local:** Ensure folder is in project root directory
- Check file paths in your code match the folder structure

## 📝 Note

This folder is intentionally excluded from Git (via `.gitignore`) to keep the repository lightweight. All team members must download images separately from Google Drive.