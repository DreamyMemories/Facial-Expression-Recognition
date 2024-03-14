# Facial Expression Recognition with TensorFlow

## Project Structure

- **hyperpara_experiment.ipynb**: This Jupyter notebook is dedicated to experimenting with various hyperparameters to optimize model performance. It provides a structured approach to fine-tune the settings for our facial expression recognition models.

- **main.ipynb**: The main notebook of the project, responsible for training all models. It serves as the central hub for model development, integrating insights and optimizations derived from other experimental files.

- **input_size_test.ipynb** and **transfer_learning.ipynb**: These notebooks are designed to experiment with different input sizes and apply transfer learning techniques, respectively. They help in understanding the impact of input resolution on model performance and leveraging pre-trained models for improved accuracy.

- **tfjs_converter.ipynb**: A concise snippet that demonstrates how to convert TensorFlow models into TensorFlow.js format. This conversion allows the models to be run in web browsers, enabling a wider range of applications.

- **webcam_demo.ipynb**: A simple PC demo that implements FER using live webcam feed. This notebook provides a practical example of the project's capabilities in real-time facial expression recognition.

- **facial-expression-mobile-app**: Contains the code for the mobile application that runs the facial expression recognition model using a live webcam feed on mobile devices. To run the mobile app:
  1. Use `yarn start` to initialize the project.
  2. Download the Expo app on your mobile device (must be compatible with version 45.0.6).
  3. Connect to the project by scanning the QR code with the Expo app.

### Installation

1. Clone the repository:<br>
```bash
git clone https://github.com/DreamyMemories/Facial-Expression-Recognition.git
```

2. Install the required Python packages: <br>
```bash
pip install -r requirements.txt
```

3. For the mobile app, navigate to the `facial-expression-mobile-app` directory and run:

```bash
cd facial-expression-mobile-app
yarn install
```