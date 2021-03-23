import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import { Button, Paper } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolderMinus,
  faFolderOpen,
  faFolderPlus,
} from "@fortawesome/free-solid-svg-icons";
import Cropper from "react-easy-crop";
import LoadingBtn from "./LoadingBtn";

const uploadFileMutation = gql`
  mutation UploadFile(
    $file: Upload!
    $crop: CropInput!
    $auth: AuthInput!
    $foodID: Int!
  ) {
    uploadFile(file: $file, crop: $crop, auth: $auth, foodID: $foodID)
  }
`;

const defaultCrop = {
  crop: { x: 0, y: 0 },
  zoom: 1,
  aspect: 5 / 6,
};
interface Props {
  foodID: number;
}

const DragNDrop: React.FC<Props> = (props) => {
  const [uploading, setUploading] = React.useState<{
    uploadClicked: boolean;
    uploading: boolean;
  }>({ uploadClicked: false, uploading: false });
  const [file, setFile] = React.useState();
  const [previewUrl, setPreviuewUrl] = React.useState<string>("");
  const [cropState, setCropState] = React.useState(defaultCrop);
  const [cropData, setCropData] = React.useState<
    { x: number; y: number; width: number; height: number } | undefined
  >();
  const [uploadFile] = useMutation(uploadFileMutation);
  const destroyUrl = () => {
    URL.revokeObjectURL(previewUrl);
    setPreviuewUrl("");
  };

  const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    setCropData({
      x: croppedAreaPixels.x,
      y: croppedAreaPixels.y,
      width: croppedAreaPixels.width,
      height: croppedAreaPixels.height,
    });
  };

  const onDrop = useCallback(([file]) => {
    if (file) {
      // Don't do anything if file is undefined
      setFile(file);
      setPreviuewUrl(URL.createObjectURL(file));
    }
  }, []);

  const onSave = () => {
    const local = localStorage.getItem("auth");
    if (cropData && local) {
      const auth = JSON.parse(local);
      console.log(auth);
      setUploading({ uploadClicked: true, uploading: true });

      uploadFile({
        variables: {
          file,
          crop: {
            x: cropData.x,
            y: cropData.y,
            width: cropData.width,
            height: cropData.height,
          },
          auth,
          foodID: props.foodID,
        },
      })
        .then(() => {
          setUploading({ uploadClicked: true, uploading: false });
          delay(400).then(() => {
            destroyUrl();
            setFile(undefined);
            setUploading({ uploadClicked: false, uploading: false });
            setCropState(defaultCrop);
          });
        })
        .catch((e) => console.error(e));
    } else {
      alert("Error uploading file");
    }
  };
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
  } = useDropzone({ onDrop, accept: "image/*" });

  const onCropChange = (crop: { x: number; y: number }) => {
    setCropState({ ...cropState, crop });
  };

  const onZoomChange = (zoom: number) => {
    setCropState({ ...cropState, zoom });
  };
  console.log(cropData);

  return (
    <div className="content">
      {!file && (
        <Paper style={{ borderRadius: 20 }}>
          <div className="drag-n-drop-container widget" {...getRootProps()}>
            <input {...getInputProps()} />
            {isDragActive && !isDragReject && (
              <>
                <FontAwesomeIcon
                  icon={faFolderPlus}
                  style={{ fontSize: "3em" }}
                />
                <p>Drop the files here ...</p>
              </>
            )}
            {!isDragActive && (
              <>
                <FontAwesomeIcon
                  icon={faFolderOpen}
                  style={{ fontSize: "3em" }}
                />
                <p>Upload your file here</p>
              </>
            )}
            {isDragReject && (
              <>
                <FontAwesomeIcon
                  icon={faFolderMinus}
                  style={{ fontSize: "3em" }}
                />
                <p>File type not accepted</p>
              </>
            )}
          </div>
        </Paper>
      )}
      {file && (
        <>
          <div
            style={{ position: "relative" }}
            className="drag-n-drop-container"
          >
            <Cropper
              image={previewUrl}
              crop={cropState.crop}
              zoom={cropState.zoom}
              aspect={cropState.aspect}
              onCropChange={onCropChange}
              onCropComplete={onCropComplete}
              onZoomChange={onZoomChange}
            />
          </div>
          <div
            style={{ display: "grid", placeItems: "center", width: "10q0%" }}
          >
            {!uploading.uploadClicked && (
              <Button
                onClick={onSave}
                variant="contained"
                color="primary"
                style={{ marginBottom: 5, width: "100%" }}
              >
                Upload
              </Button>
            )}
            {uploading.uploadClicked && (
              <LoadingBtn
                loading={uploading.uploading}
                success={!uploading.uploading}
              />
            )}
            <Button
              onClick={() => {
                setFile(undefined);
                setUploading({ uploadClicked: false, uploading: false });
                destroyUrl();
                setCropState(defaultCrop);
              }}
              variant="contained"
              style={{ width: "100%" }}
            >
              Cancel
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default DragNDrop;

const delay = (ms: number) => new Promise((res, _) => setTimeout(res, 400));
