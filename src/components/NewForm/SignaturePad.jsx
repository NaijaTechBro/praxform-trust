import React, { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';

const SignaturePad = ({ isBuilderPreview }) => {
    const sigPad = useRef(null);

    // This function clears the signature pad
    const clearPad = () => {
        sigPad.current.clear();
    };

    // This is a placeholder for saving the signature.
    // In a real form, you'd pass a function here to save the data URL.
    const saveSignature = () => {
        if (sigPad.current.isEmpty()) {
            alert("Please provide a signature first.");
        } else {
            const dataUrl = sigPad.current.getTrimmedCanvas().toDataURL('image/png');
           // console.log("Signature Data URL:", dataUrl); // You can see the saved image data in the console
            alert("Signature Saved! (Check Console)");
        }
    };

    // If we are in the form builder, show a simple, non-interactive placeholder.
    if (isBuilderPreview) {
        return (
            <div className="w-full h-24 border border-dashed border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700/50 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                [Signature Pad]
            </div>
        );
    }

    // If we are in the live form preview, show the fully functional signature pad.
    return (
        <div className="relative w-full aspect-[2/1] bg-white rounded-md border border-gray-300 dark:border-gray-600">
            <SignatureCanvas
                ref={sigPad}
                penColor='black'
                canvasProps={{ className: 'w-full h-full' }}
            />
            <div className="absolute bottom-2 right-2 flex space-x-2">
                <button 
                    type="button" 
                    onClick={clearPad} 
                    className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                    Clear
                </button>
            </div>
             <div className="absolute top-2 right-2 text-xs text-gray-400">
                Sign Here
            </div>
        </div>
    );
};

export default SignaturePad;