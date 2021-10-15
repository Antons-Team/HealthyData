import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
} from 'react-native';

import { TodoItem } from '../@types/Schema';
import DropDownPicker from 'react-native-dropdown-picker';
import {styles} from '../style/Styles';

import {
  BarChart,
  LineChart,
} from 'react-native-chart-kit';

import { Dimensions } from "react-native";
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import { Dataset, ChartData } from 'react-native-chart-kit/dist/HelperTypes'
import { AbstractChartConfig } from 'react-native-chart-kit/dist/AbstractChart';


const Data = (): JSX.Element => {
  // TODO filter by medication
  const [medications, setMedications] = useState<Array<string>>([]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([{label: "Apple", value: "apple"}]);
  // Bar chart data retreived from firestore
  const [data, setData] = useState<Array<number>>([0, 0, 0, 0, 0, 0, 0])
  const [average, setAverage] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  const screenWidth = Dimensions.get("window").width;
  let barChartData: Dataset = {
    data: data
  }

  useEffect(() => {
    getChartData()
    barChartData.data = data;
  })

  useEffect(() => {
    computeStatistics();
  })

  const computeStatistics = async() => {
    const total = data.reduce((a, b) => a + b, 0)
    setTotal(total);
    setAverage(total / data.length || 0);
  }

  const getChartData = async() => {
    firestore().collection(`users/${auth().currentUser?.uid}/todos`).get().then(snapshot => {
      const docs = snapshot.docs;

      const data = docs.map(doc => {
        return (doc.data()) as TodoItem;
      });

      const result = [0, 0, 0, 0, 0, 0, 0];

      data.map(todo => {
        if (todo.days?.sunday) {
          result[0] += todo.doses
        }
        if (todo.days?.monday) {
          result[1] += todo.doses
        }
        if (todo.days?.tuesday) {
          result[2] += todo.doses
        }
        if (todo.days?.wednesday) {
          result[3] += todo.doses
        }
        if (todo.days?.thursday) {
          result[4] += todo.doses
        }
        if (todo.days?.friday) {
          result[5] += todo.doses
        }
        if (todo.days?.saturday) {
          result[6] += todo.doses
        }

        setData(result);
      });

    }).catch(e => {
      console.error(e);
    });
  }

  
  // Data to be passed to the line chart
  const chartData: ChartData = {
    labels: ["S", "M", "T", "W", "T", "F", "S"],
    datasets: [
      barChartData
    ]
  };

  // Chart configuration for the line chart
  const chartConfig: AbstractChartConfig = {
    backgroundGradientFromOpacity: 0,
    backgroundGradientToOpacity: 0,
    color: (opacity = 1) => `rgba(66, 135, 245, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 1,
    useShadowColorFromDataset: false
  };

  return (
    <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'flex-start', margin: 8, }}>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        style={styles.dropDown}
      />
      <LineChart
        style={{
          marginVertical: 8,
          borderRadius: 16,
          marginTop: 32,
        }}
        data={chartData}
        width={screenWidth*0.95}
        height={250}
        yAxisLabel=""
        yAxisSuffix=""
        chartConfig={chartConfig}
        verticalLabelRotation={0}
      />
      <View style={{alignContent: 'flex-start', margin: 4}}>
        <Text style={styles.title}>Total Doses over Week: {total} </Text>
        <Text style={styles.title}>Average per Day: {average}</Text>
      </View>
    </View>
  );
};

export default Data;
