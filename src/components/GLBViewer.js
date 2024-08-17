import React, { useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Container, Row, Col, Form, Button } from "react-bootstrap";

const GLBViewer = () => {
  const [model, setModel] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [videoURL, setVideoURL] = useState(null);
  const canvasRef = useRef();
  const mediaRecorderRef = useRef();
  const recordedChunks = useRef([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.name.endsWith(".glb")) {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = () => {
        const arrayBuffer = reader.result;
        const blob = new Blob([arrayBuffer], { type: "model/gltf-binary" });
        const url = URL.createObjectURL(blob);
        setModel(url);
      };
    } else {
      alert("Please upload a valid GLB file.");
    }
  };

  const GLBModel = () => {
    const gltf = useGLTF(model, true);

    // Rotate the model
    useFrame((state, delta) => {
      gltf.scene.rotation.y += delta * 0.5; // Adjust speed here
    });

    return <primitive object={gltf.scene} scale={1} />;
  };

  const startRecording = () => {
    if (canvasRef.current) {
      const stream = canvasRef.current.captureStream(30); // 30 FPS
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunks.current.push(event.data);
        }
      };
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(recordedChunks.current, { type: "video/webm" });
        setVideoURL(URL.createObjectURL(blob));
        recordedChunks.current = [];
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const downloadVideo = () => {
    if (videoURL) {
      const a = document.createElement("a");
      a.href = videoURL;
      a.download = "recording.webm";
      a.click();
    }
  };

  const openVideoInNewTab = () => {
    if (videoURL) {
      window.open(videoURL, "_blank");
    }
  };

  return (
    <Container>
      <Row className="my-0">
        <Col>
          <Form.Group controlId="formFile">
            <Form.Label className="my-0">Upload GLB File</Form.Label>
            <Form.Control
              className="my-0"
              type="file"
              accept=".glb"
              onChange={handleFileUpload}
            />
          </Form.Group>
          <Button
            variant={isRecording ? "danger" : "primary"}
            onClick={isRecording ? stopRecording : startRecording}
          >
            {isRecording ? "Stop Recording" : "Start Recording"}
          </Button>
          {videoURL && (
            <>
              <Button
                variant="secondary"
                onClick={downloadVideo}
                style={{ margin: "0 10px" }}
              >
                Download Video
              </Button>
              <Button variant="dark" onClick={openVideoInNewTab}>
                Open Video in New Tab
              </Button>
            </>
          )}
        </Col>
      </Row>
      <Row>
        <Col>
          {model && (
            <Canvas
              ref={canvasRef}
              style={{ height: "calc(100vh - 150px)" }}
              camera={{ position: [0, 0, 5], fov: 75 }}
            >
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} />
              <GLBModel />
              <OrbitControls />
            </Canvas>
          )}
        </Col>
      </Row>
      {videoURL && (
        <Row>
          <Col>
            <video
              controls
              src={videoURL}
              style={{ width: "100%", marginTop: "10px" }}
            />
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default GLBViewer;
