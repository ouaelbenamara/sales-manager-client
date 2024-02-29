import React, { useEffect, useState } from 'react'
import { BoxHeader, Dashboard, Dashboard1, Dashboard2, Dashboard3, Wrapper } from './styles'
import { Box, Typography, ButtonGroup, Button, Paper, Grid, Stack } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { selectSales, setSaleToStore } from '../../features/sales/saleSlice'
import { calculateFond, calculateGains } from '../../helpers/functions'
import { selectProducts, setProduct } from '../../features/products/productSlice'
import { useGetProductsMutation, useGetSalesMutation } from '../../app/api/apiSlice'
import CustomCircularPogress from '../utils/CircularProgress'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'; 
import { CartesianGrid, Line, LineChart, PieChart, Tooltip, XAxis, YAxis }from 'recharts'
function Main() {

    const [sales, setSales] = useState(null)
    const [mergedItems, setMergedItems] = useState(null)
    const [items, setItems] = useState(null)
    const [fond, setFond] = useState(0)
    const [gains, setGains] = useState(0)
    const [fayda, setFayda] = useState(0)
    const [calculs, setCalculs] = useState(false)
    const [selectedMonth, setSelectedMonth] = useState(null)
    const [selectedYear, setSelectedYear] = useState(true)
    const [selectedDay, setSelectedDay] = useState(null)
    const [progress, setProgress] = useState(false)
    const dispatch = useDispatch()




    const [getProducts, getProductsResult] = useGetProductsMutation()
    const [getSales, getSalesResult] = useGetSalesMutation()
    const salesFromStore = useSelector(selectSales)
    const itemsFromStore = useSelector(selectProducts)

    useEffect(() => {
        getProducts()
        getSales()

    }, [])
useEffect(()=>{
    setSales(salesFromStore)
    setItems(itemsFromStore)

}, [salesFromStore,itemsFromStore])


    useEffect(() => {
        const calculateSummary = () => {
            if(sales){
            // Initialize an empty object to store the summed counts for each item name
            const summary = sales.reduce((acc, item) => {
                // For each item in the sales array, update the accumulator with the count
                // for the corresponding item name
                acc[item.saleName] = (acc[item.saleName] || 0) + item.count;
                return acc;
            }, {});

            // Convert the summary object back to an array of objects
            const summaryArray = Object.keys(summary).map(saleName => ({ saleName, count: summary[saleName] }));

            return summaryArray;}
        };
        const newSummaryArray = calculateSummary();
        console.log(newSummaryArray);
        setMergedItems(newSummaryArray)
        // You can set the new summary array to the state or use it as needed

      
    }, [sales]);

    useEffect(()=>{
        console.log(mergedItems)
    }, [mergedItems])




    useEffect(() => {
        if (getProductsResult.useState === 'rejected') {
            setProgress(false)

            console.log('failed to load sales from server')
        } else if (getProductsResult.status === 'fulfilled') {
            setProgress(false)

            dispatch(setProduct(getProductsResult.data))
            setItems(getProductsResult.data)


        } else if (getProductsResult.status === 'pending') {
            setProgress(true)

        }

    }, [getProductsResult])
    useEffect(() => {
        if (getSalesResult.state === 'rejected') {
            setProgress(false)

            console.log('failed to load items from server')
        } else if (getSalesResult.status === 'fulfilled') {
            setProgress(false)
            setSales(getSalesResult.data)

            dispatch(setSaleToStore(getSalesResult.data))
        } else if (getSalesResult.status === 'pending') {
            setProgress(true)

        }

    }, [getSalesResult])



    useEffect(() => {
        if (sales) {
            const { fayda, gains } = calculateGains(sales, selectedDay, selectedMonth, selectedYear)
            setGains(gains)
            setFayda(fayda)

        }
        if (items) {
            setFond(calculateFond(items))
        }

    }, [sales, items, selectedDay, selectedMonth, selectedYear])

    useEffect(() => {
        if (sales && (selectedDay || selectedMonth || selectedYear)) {
            setCalculs(calculateGains(sales, selectedDay, selectedMonth, selectedYear));


        }





    }, [sales, selectedDay, selectedMonth, selectedYear]);
    useEffect(() => {
        if (items) {
            setFond(calculateFond(items));
        }
    }, [items])
    useEffect(() => {
        if (calculs) {
            console.log(calculs)
            setFayda(calculs.fayda)
            setGains(calculs.gains)
        }
    }, [calculs])

    return (
        <Wrapper>
            <Box width={'100%'}>
                <Typography variant='h3'>DASHBOARD</Typography>
                <BoxHeader direction={'column'} spacing={1}>
                    <Box ><ButtonGroup  >

                        <Button variant={selectedMonth ? 'contained' : 'outlined'} onClick={(e) => {
                            setSelectedDay(null)

                            setSelectedYear(null)
                            setSelectedMonth(true)

                        }}>Monthly</Button>
                        <Button variant={selectedYear ? 'contained' : 'outlined'} onClick={(e) => {
                            setSelectedDay(null)
                            setSelectedMonth(null)

                            setSelectedYear(true)

                        }}>Yearly</Button>
                        <Button variant={selectedDay ? 'contained' : 'outlined'} onClick={(e) => {
                            setSelectedDay(true)
                            setSelectedMonth(null)
                            setSelectedYear(null)

                        }}>Daily</Button>
                    </ButtonGroup></Box>
                    <Box display={'flex'} flexDirection={'column'}>

                        <Grid container spacing={3}>
                            <Grid item xs={4}>
                                <Paper elevation={3} style={{  minWidth: '90px',padding: '20px', backgroundColor:'blue'  }}>
                                    <Typography color={'white'} variant="h6">Stock</Typography>
                                    <Typography color={'white'} variant="h4">{fond}</Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={4}>
                                <Paper elevation={3} style={{  minWidth: '90px', padding: '20px', backgroundColor: 'orange' }}>
                                    <Typography color={'white'} variant="h6">Sales</Typography>
                                    <Typography color={'white'} variant="h4">{gains}</Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={4}>
                                <Paper elevation={3} style={{  minWidth:'90px', padding: '20px', backgroundColor: 'green' }}> 
                                    <Typography color={'white'} variant="h6">Gains<TrendingUpIcon/></Typography>
                                    <Typography color={'white'} variant="h4">{fayda}</Typography>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Box>
                </BoxHeader>
            </Box>
            <Stack direction="row">



            </Stack>
            {progress ? <CustomCircularPogress
            /> : null}
            <Box width={'100%'} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                <LineChart width={450} height={300} data={mergedItems} margin={{ top: 5, right: 25, bottom: 5, left: 0 }}>
                    <Line type="monotone" dataKey="count" stroke="#8884d8" />
                    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                    <XAxis dataKey="saleName" />
                    <YAxis />
                    <Tooltip />
                </LineChart>
            </Box>
            
        </Wrapper>
    )
}

export default Main
