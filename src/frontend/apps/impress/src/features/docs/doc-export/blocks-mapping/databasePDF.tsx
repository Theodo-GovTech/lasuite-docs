import { StyleSheet, Text, View } from '@react-pdf/renderer';

import { DocsExporterPDF } from '../types';

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    padding: 8,
    gap: 4,
  },
  emoji: {
    fontSize: 16,
  },
  text: {
    maxWidth: '94%',
    paddingTop: 2,
  },
});

export const blockMappingDatabasePDF: DocsExporterPDF['mappings']['blockMapping']['database'] =
  () => {
    return (
      <View wrap={false} style={styles.wrapper}>
        <Text debug={false} style={styles.text}>
          {' '}
        </Text>
      </View>
    );
  };
