import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Modal from "@mui/material/Modal";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import axios from "axios";
interface TrackDetailModalProps {
  trackId: string;
  handleClose: () => void;
}
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: 250, sm: 400 },
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
const defaultMessage =
  "A status update is not yet available on your package. It will be available when the shipper provides an update or the package is delivered to USPS. Check back soon.";
export const TrackDetailModal: React.FC<TrackDetailModalProps> = ({
  trackId,
  handleClose,
}) => {
  const [trackSummary, setTrackSummary] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getTrackDetailsFromUSPS = async () => {
      try {
        const trackUserId = process.env.REACT_APP_USPS_TRACK_USERID;
        const trackPassword = process.env.REACT_APP_USPS_TRACK_PASSWORD;
        const trackApiBaseUrl = process.env
          .REACT_APP_USPS_TRACK_API_ROUTE as string;

        const trackAPIResponseData = await axios.get(trackApiBaseUrl, {
          params: {
            API: "TrackV2",
            XML: `<TrackRequest USERID="${trackUserId}" PASSWORD="${trackPassword}"><TrackID ID="${trackId}"></TrackID></TrackRequest>`,
          },
          headers: {
            "Content-Type": "text/xml",
          },
        });
        const match = trackAPIResponseData.data
          ?.split("<TrackSummary>")[1]
          ?.split("</TrackSummary>")[0];

        setTrackSummary(match || defaultMessage);
      } catch (error) {
        console.log({ error });
      } finally {
        setIsLoading(false);
      }
    };
    getTrackDetailsFromUSPS();
  }, [trackId]);
  return (
    <>
      <Modal
        open={true}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box
            sx={{
              marginBottom: "-30px",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <IconButton sx={{ transform: "translate(70%,-70%)" }}>
              <CloseIcon
                sx={{
                  color: "black",
                  cursor: "pointer",
                }}
                onClick={handleClose}
              />
            </IconButton>
          </Box>
          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <CircularProgress />
            </Box>
          ) : (
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              {trackSummary}
            </Typography>
          )}
        </Box>
      </Modal>
    </>
  );
};
