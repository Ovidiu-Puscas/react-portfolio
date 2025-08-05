import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  PDFDownloadLink,
  BlobProvider,
  Font,
} from '@react-pdf/renderer';

// Register fonts
Font.register({
  family: 'Roboto',
  src: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxK.ttf',
});

// Register fallback font
Font.register({
  family: 'Helvetica',
  src: 'Helvetica',
});

// Define styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: 'Helvetica',
  },
  header: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  content: {
    marginBottom: 20,
  },
  signatureSection: {
    marginTop: 50,
    borderTop: 1,
    paddingTop: 20,
  },
  signatureImage: {
    width: 150,
    height: 60,
  },
});

// PDF Document Component
const PDFDocument = ({ title, content, signatureData, date, signerName }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View>
        <Text style={styles.header}>{title}</Text>

        <View style={styles.content}>
          <Text>{content}</Text>
        </View>

        {signatureData && (
          <View style={styles.signatureSection}>
            <Text>Signed by: {signerName}</Text>
            <Text>Date: {date}</Text>
            <Image src={signatureData} style={styles.signatureImage} />
          </View>
        )}
      </View>
    </Page>
  </Document>
);

// Wrapper Component with Export Options
const PDFGenerator = ({
  title,
  content,
  signatureData,
  date,
  showDownload = true,
  showPreview = false,
  signerName,
}) => (
  <div className="pdf-generator space-y-4">
    {showPreview && (
      <div className="mb-4">
        <div className="border border-gray-300 rounded-lg overflow-hidden">
          <BlobProvider
            document={
              <PDFDocument
                title={title}
                content={content}
                signatureData={signatureData}
                date={date}
                signerName={signerName}
              />
            }
          >
            {({ url, loading }) =>
              loading ? (
                <div className="flex items-center justify-center h-64 sm:h-[35rem] bg-gray-50">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-gray-600">Generating PDF preview...</p>
                  </div>
                </div>
              ) : url ? (
                <iframe
                  src={url}
                  className="w-full h-64 sm:h-[35rem] border-0"
                  title="PDF Preview"
                />
              ) : (
                <div className="flex items-center justify-center h-64 sm:h-[35rem] bg-gray-50">
                  <p className="text-red-600">Error loading PDF preview</p>
                </div>
              )
            }
          </BlobProvider>
        </div>
      </div>
    )}

    {showDownload && (
      <div className="text-center">
        <PDFDownloadLink
          document={
            <PDFDocument
              title={title}
              content={content}
              signatureData={signatureData}
              date={date}
              signerName={signerName}
            />
          }
          fileName={`${title.replace(/\s+/g, '_')}.pdf`}
        >
          {({ loading }) => (
            <button
              disabled={loading}
              className={`w-full px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Generating PDF...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Download PDF
                </div>
              )}
            </button>
          )}
        </PDFDownloadLink>
      </div>
    )}
  </div>
);

export default PDFGenerator;
