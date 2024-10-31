import React, { useEffect, useState } from 'react';
import './MarginsAndPadding.css';
import CustomInput from './CustomInput';
import axios, { AxiosError } from 'axios';
import { Response_Type } from '../type';
import toast, { Toaster } from 'react-hot-toast';

const MarginsAndPadding: React.FC = () => {
  const [marginData, setMarginData] = useState<Response_Type[] | null>(null);
  const [paddingData, setPaddingData] = useState<Response_Type[] | null>(null);

  const getDataHandler = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/margins-padding`
      );
      if (res.data as Response_Type[]) {
        const marginRes: Response_Type[] = res.data.filter(
          (data: Response_Type) => data.type === 'margin'
        );
        const paddingRes: Response_Type[] = res.data.filter(
          (data: Response_Type) => data.type === 'padding'
        );
        setMarginData(marginRes);
        setPaddingData(paddingRes);
      }
    } catch (error) {
      const axiosError = error as AxiosError;
    
      if (axiosError.response && axiosError.response.data) {
        const data = axiosError.response.data as {error: string};
        toast.error(data.error);
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  const postMarginAndPaddingHandler = async(body:{id: number, value: number, unit: string})=>{
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/margins-padding`, body
      );
      if(res.data){
        const data = res.data;
        await getDataHandler()
        if(data.value !== null){
          toast.success(`Set ${data.direction} ${data.type}`);
        }else{
          toast.success(`Remove ${data.direction} ${data.type}`);
        }
      }
    } catch (error) {
      const axiosError = error as AxiosError;
    
      if (axiosError.response && axiosError.response.data) {
        const data = axiosError.response.data as {error: string};
        toast.error(data.error);
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  }

  useEffect(() => {
    getDataHandler();
  }, []);

  return (
    <>
    <Toaster/>
    <div className='container'>
      <div className='box'>
        {marginData?.map((data) => {
          return (
            <CustomInput
              key={data.id}
              directionClasses={data.direction}
              defaultValue={{id: data.id, value: data.value, unit: data.unit }}
              postHandler={postMarginAndPaddingHandler}
            />
          );
        })}
        <div className='inner-box'>
          {paddingData?.map((data) => {
            return (
              <CustomInput
              key={data.id}
                directionClasses={`inner-${data.direction}`}
                defaultValue={{id: data.id, value: data.value, unit: data.unit }}
                postHandler={postMarginAndPaddingHandler}
              />
            );
          })}
        </div>
      </div>
    </div>
    </>
  );
};

export default MarginsAndPadding;
