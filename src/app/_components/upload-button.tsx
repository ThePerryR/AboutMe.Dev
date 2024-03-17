"use client";
 
import { UploadButton } from "~/utils/uploadthing";
 
export default function UploadButtonWrapper () {
  return (
      <UploadButton
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          // Do something with the response
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
        }}
      />
  );
}
