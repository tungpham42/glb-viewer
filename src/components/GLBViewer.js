import React, { useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Container, Row, Col, Form } from "react-bootstrap";

const GLBViewer = () => {
  const [model, setModel] = useState(null);
  const [rotation, setRotation] = useState([0, 0, 0]);

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
        </Col>
      </Row>
      <Row>
        <Col>
          {model && (
            <Canvas style={{ height: "calc(100vh - 110px)" }}>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} />
              <GLBModel />
              <OrbitControls />
            </Canvas>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default GLBViewer;
