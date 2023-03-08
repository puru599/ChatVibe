import React, {
  useImperativeHandle,
  useState,
  forwardRef
} from "react";
import { useSelector } from "react-redux";
import ReactDOM from "react-dom";
import axios from "axios";
import classes from "./sendFileOptions.module.css";

const SendFile = forwardRef((props, ref) => {
  const id = document.getElementById("openGroupOptionsModal");

  const [file, setFile] = useState(null);
  const [fileData, setFilesData] = useState([]);
  const [groupOpsVisib, setGroupOpsVisib] = useState(false);

  const activeFriendData = useSelector((state) => state.chat.activeFriendData);
  const friendData = useSelector((state) => state.chat.activeFriend);

  const { userId, userName } = JSON.parse(localStorage.getItem("userData"));

  useImperativeHandle(ref, () => {
    return {
      setSendFileHandler: setSendFileHandler
    };
  });

  const setSendFileHandler = (bool) => {
    setGroupOpsVisib(bool);
  };

  const openFileUpload = (event) => {
    setFile(event.target.files[0]);
  };

  const sendFileHandler = (event) => {
    event.preventDefault();
    let fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = (e) => {
      sendFileAxios(e.target.result);
    };
    const sendFileAxios = async (fileUrl) => {
      try {
        console.log(fileUrl);
        const response = await axios.post("https://group-chat-backend-i2bd.onrender.com/sendFile", {
          fileUrl: fileUrl,
          fileName: file.name,
          userId: userId,
          userName: userName,
          toId: friendData.id,
          toName: friendData.userName
        });
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    };
  };

  const fetchFilesData = async () => {
    const { userId } = JSON.parse(localStorage.getItem("userData"));
    try {
      const response = await axios.get("https://group-chat-backend-i2bd.onrender.com/fetchFile", {
        headers: {
          userId: userId,
          toId: activeFriendData.id
        }
      });

      if (response.status === 200) {
        setFilesData(response.data);
      } else {
        throw new Error("Something went wrong");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const Backdrop = () => {
    const onClose = () => {
      setGroupOpsVisib(false);
    };
    return <div className={classes.backdrop} onClick={onClose}></div>;
  };

  const Overlay = () => {
    return (
      <div className={classes.modal}>
        <form onSubmit={sendFileHandler} className={classes.sendFileOp}>
          <input type="file" name="file" onChange={openFileUpload}></input>
          <button>Send File</button>
        </form>
        <button onClick={fetchFilesData}>Open Sent Files</button>
        <ul className={classes.sentFiles}>
          {fileData.map((file) => (
            <li key={Math.random()}>
              <a href={file.fileUrl}>{file.fileName}</a>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <React.Fragment>
      {!!groupOpsVisib ? (
        <React.Fragment>
          {ReactDOM.createPortal(<Backdrop onClose={props.onClose} />, id)}
          {ReactDOM.createPortal(<Overlay>{props.children}</Overlay>, id)}
        </React.Fragment>
      ) : null}
    </React.Fragment>
  );
});

export default SendFile;
