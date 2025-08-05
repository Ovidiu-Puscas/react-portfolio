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
} from '@react-pdf/renderer';

// Define styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: 'Roboto',
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
  <div className="pdf-generator">
    {showDownload && (
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
        {({ loading }) => (loading ? 'Generating PDF...' : 'Download PDF')}
      </PDFDownloadLink>
    )}

    {showPreview && (
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
            'Loading PDF...'
          ) : url ? (
            <iframe src={url} title="PDF Preview" />
          ) : (
            'Error loading PDF'
          )
        }
      </BlobProvider>
    )}
  </div>
);

export default PDFGenerator;
