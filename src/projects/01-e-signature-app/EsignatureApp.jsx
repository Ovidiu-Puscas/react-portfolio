import React, { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import PDFGenerator from './components/PDFGenerator';

export default function EsignatureApp() {
  const sigPadRef = useRef();
  const [signatureData, setSignatureData] = useState(null);
  const [documentTitle, setDocumentTitle] = useState('Sample Document');
  const [documentContent, setDocumentContent] = useState('This is a sample document content.');
  const [signerName, setSignerName] = useState('John Doe');

  const handleSaveSignature = () => {
    if (sigPadRef.current.isEmpty()) {
      alert('Please provide a signature first!');
      return;
    }
    
    const signatureDataUrl = sigPadRef.current.toDataURL();
    setSignatureData(signatureDataUrl);
  };

  const handleClearSignature = () => {
    sigPadRef.current.clear();
    setSignatureData(null);
  };

  return (
    <div className="min-h-[calc(100dvh-65px)] bg-gradient-to-br from-blue-50 to-indigo-100">
      
      {/* Mobile-first responsive layout */}
      <div className="flex flex-col lg:grid lg:grid-cols-10 lg:gap-0 h-full">
        {/* Left Column - Signature Form (30% on desktop, full width on mobile) */}
        <div className="lg:col-span-3 bg-white p-4 sm:p-6 lg:p-8 overflow-y-auto order-2 lg:order-1">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">Document Details</h2>
          
          {/* Document Form */}
          <div className="space-y-4 mb-6 sm:mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Document Title</label>
              <input
                type="text"
                value={documentTitle}
                onChange={(e) => setDocumentTitle(e.target.value)}
                placeholder="Enter document title"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Document Content</label>
              <textarea
                value={documentContent}
                onChange={(e) => setDocumentContent(e.target.value)}
                placeholder="Enter document content"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all h-24 sm:h-32 resize-none text-sm sm:text-base"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Signer Name</label>
              <input
                type="text"
                value={signerName}
                onChange={(e) => setSignerName(e.target.value)}
                placeholder="Enter signer name"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
              />
            </div>
          </div>

          {/* Signature Section */}
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Digital Signature</h3>
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-4">
              <SignatureCanvas 
                ref={sigPadRef}
                penColor='#1f2937'
                canvasProps={{
                  width: 300, 
                  height: 120, 
                  className: 'sigCanvas border-2 border-gray-300 rounded-lg mx-auto bg-white w-full max-w-[300px] h-[100px] sm:h-[120px]'
                }} 
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button 
                onClick={handleSaveSignature}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 text-sm sm:text-base"
              >
                Save Signature
              </button>
              <button 
                onClick={handleClearSignature}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 text-sm sm:text-base"
              >
                Clear Signature
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - PDF Preview (70% on desktop, full width on mobile) */}
        <div className="lg:col-span-7 bg-white p-4 sm:p-6 lg:p-8 overflow-y-auto order-1 lg:order-2">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">PDF Preview</h2>
          
          {signatureData ? (
            <div className="space-y-4">
              <PDFGenerator
                title={documentTitle}
                content={documentContent}
                signatureData={signatureData}
                date={new Date().toLocaleDateString()}
                showDownload={true}
                showPreview={true}
                signerName={signerName}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 sm:h-96 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-4">
              <svg className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mb-3 sm:mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-500 text-base sm:text-lg font-medium text-center">Complete the form and add your signature to see the PDF preview</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}