import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { Paper } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderMinus, faFolderOpen, faFolderPlus } from "@fortawesome/free-solid-svg-icons";

const uploadFileMutation = gql`
  mutation UploadFile($file: Upload!) {
    uploadFile(file: $file)
  }
`;
const filesQuery = gql`
  {
    files
  }
`;


const DragNDrop = () => {
const [file, setFile] = React.useState();

  const [uploadFile] = useMutation(uploadFileMutation, {
    refetchQueries: [{ query: filesQuery }]
  });
  React.useEffect(() => () => {
    // Make sure to revoke the data uris to avoid memory leaks
    if(file){
      URL.revokeObjectURL(file.preview);
    }
  }, [file]);

  const onDrop = useCallback(
    ([file]) => {
      setFile({...file, preview: URL.createObjectURL(file)});
    },
    []
  );
  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({ onDrop, accept: "image/png" });

  console.log(file);
  
  return (
    <Paper style={{ borderRadius: 20 }}>
      <div className="drag-n-drop-container" {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive && !isDragReject &&  (
          <>
            <FontAwesomeIcon icon={faFolderPlus} style={{ fontSize: "3em" }} />
            <p>Drop the files here ...</p>
          </>
        )}
        {!isDragActive && (
          <>
            <FontAwesomeIcon icon={faFolderOpen} style={{ fontSize: "3em" }} />
            <p>Upload your file here</p>
          </>
        )}
        {isDragReject && (
          <>
            <FontAwesomeIcon icon={faFolderMinus} style={{fontSize: "3em"}} />
            <p>File type not accepted</p>
          </>
        )}
      </div>
      {file && <img src={file.preview} />}
    </Paper>
  );
};

export default DragNDrop;