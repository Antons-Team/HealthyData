import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';

import {TodoItem} from '../@types/Schema';
import DropDownPicker from 'react-native-dropdown-picker';
import {styles} from '../style/Styles';

import {renderName} from '../utils/Display';

import {BarChart} from 'react-native-chart-kit';

import {Dimensions} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import {Dataset, ChartData} from 'react-native-chart-kit/dist/HelperTypes';
import {AbstractChartConfig} from 'react-native-chart-kit/dist/AbstractChart';
import {BLUE, WHITE} from '../style/Colours';

/**
 * fetches weekly medication data for a user that is to be displayed on the chart
 * @param medication medication to get the data for
 * @param setData callback after data has been fetched
 */
const getChartData = async (
  medication: string | null,
  setData: React.Dispatch<React.SetStateAction<number[]>>,
) => {
  firestore()
    .collection(`users/${auth().currentUser?.uid}/todos`)
    .get()
    .then(snapshot => {
      const docs = snapshot.docs;

      const data = docs.map(doc => {
        return doc.data() as TodoItem;
      });

      const result = [0, 0, 0, 0, 0, 0, 0];

      data.map(todo => {
        if (medication != null && todo.medication.genericName != medication) {
          return;
        }

        if (todo.days?.sunday) {
          result[0] += todo.doses;
        }
        if (todo.days?.monday) {
          result[1] += todo.doses;
        }
        if (todo.days?.tuesday) {
          result[2] += todo.doses;
        }
        if (todo.days?.wednesday) {
          result[3] += todo.doses;
        }
        if (todo.days?.thursday) {
          result[4] += todo.doses;
        }
        if (todo.days?.friday) {
          result[5] += todo.doses;
        }
        if (todo.days?.saturday) {
          result[6] += todo.doses;
        }
      });
      setData(result);
    })
    .catch(e => {
      console.error(e);
    });
};

/**
 * Gets all medications that the user can select from
 */
const getDropdownOptions = async (
  medications: Array<string>,
  setMedications: React.Dispatch<React.SetStateAction<string[]>>,
  items: Array<Object>,
  setItems: React.Dispatch<React.SetStateAction<Object[]>>,
) => {
  firestore()
    .collection(`users/${auth().currentUser?.uid}/todos`)
    .get()
    .then(snapshot => {
      const docs = snapshot.docs;

      const data = docs.map(doc => {
        return doc.data() as TodoItem;
      });

      let medications: Array<string> = [];
      let items: Array<any> = [];

      data.map(todo => {
        if (!medications.includes(todo.medication?.genericName)) {
          medications = [...medications, todo.medication.genericName];

          items = [
            ...items,
            {
              label: renderName(todo.medication.genericName),
              value: todo.medication.genericName,
            },
          ];
        }
      });

      setMedications(medications);
      setItems(items);
    })
    .catch(e => {
      console.error(e);
    });
};

/**
 * @returns Screen component for displaying data visualizations
 */
const Data = (): JSX.Element => {
  // names of medications the user is taking
  const [medications, setMedications] = useState<Array<string>>([]);
  // true iff the dropdown menu is open
  const [open, setOpen] = useState<boolean>(false);
  // name of the currenly selected medciation
  const [selected, setSelected] = useState<string | null>(null);
  // medications the user is taking
  const [items, setItems] = useState<Array<Object>>([{}]);
  // Bar chart data retreived from firestore
  const [data, setData] = useState<Array<number>>([0, 0, 0, 0, 0, 0, 0]);
  // average number of doeses the user takes in a week for a given medication
  const [average, setAverage] = useState<number>(0);
  // total number of doeses the user takes in a week for a given medication
  const [total, setTotal] = useState<number>(0);

  const screenWidth = Dimensions.get('window').width;
  const barChartData: Dataset = {
    data: data,
  };

  useEffect(() => {
    getDropdownOptions(medications, setMedications, items, setItems);
  }, []);

  useEffect(() => {
    getChartData(selected, setData);
    barChartData.data = data;
  }, [selected]);

  useEffect(() => {
    computeStatistics();
  }, [data, selected]);

  const computeStatistics = async () => {
    const total = data.reduce((a, b) => a + b, 0);
    setTotal(total);
    setAverage(total / data.length || 0);
  };

  // Data to be passed to the line chart
  const chartData: ChartData = {
    labels: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    datasets: [barChartData],
  };

  // Chart configuration for the line chart
  const chartConfig: AbstractChartConfig = {
    backgroundGradientFromOpacity: 0,
    backgroundGradientToOpacity: 0,
    color: (opacity = 1) => BLUE,
    strokeWidth: 2,
    barPercentage: 1,
    useShadowColorFromDataset: false,
    fillShadowGradientOpacity: 1,
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        margin: 8,
      }}>
      <Text style={[styles.infoTitle, {fontSize: 30, paddingBottom: 29}]}>
        Weekly Summary
      </Text>
      <DropDownPicker
        itemKey={'label'}
        open={open}
        value={selected}
        items={items}
        setOpen={setOpen}
        setValue={setSelected}
        setItems={setItems}
        style={styles.dropDown}
        labelStyle={[styles.textBold, {fontSize: 18}]}
        textStyle={{fontSize: 18, backgroundColor: WHITE, opacity: 1}}
      />
      <BarChart
        style={{
          marginVertical: 8,
          borderRadius: 16,
          marginTop: 32,
        }}
        data={chartData}
        width={screenWidth * 0.95}
        height={250}
        yAxisLabel=""
        yAxisSuffix=""
        chartConfig={chartConfig}
        verticalLabelRotation={0}
        fromZero={true}
      />

      <View style={{alignContent: 'flex-start', margin: 4}}>
        <Text style={styles.title}>
          Total Doses over Week:{' '}
          <Text style={[styles.title, {color: BLUE}]}> {total} </Text>
        </Text>
        <Text style={styles.title}>
          Average doses per day:{' '}
          <Text style={[styles.title, {color: BLUE}]}>
            {' '}
            {average.toFixed(2)}{' '}
          </Text>
        </Text>
      </View>
    </View>
  );
};

export default Data;
