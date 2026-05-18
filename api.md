비고    1. 주소는 반드시 지번 주소로 보내야 합니다.
2. PDF 생성 요청시 산정된 가격(시세추정가) 이 있을 경우에만 요청합니다  인증키  데이터 관련 인증키 :   e6dd7a52106290e637852543e76bc1109f34af87c1d544e1e7c39b43a6753c0c
PDF 인   증       키 :   fc7cb09b4162d8e1fd0e092069c0d23bfde0c74db748b1c900d71d96ae683bf8
URL SERVICE_ID  서비스명 설명   인증키 종류 메서드 방식 출력    비고
/api/ewha/pdfresult SVC_PDF_RESULT  토지_단독 일 경우 
PDF 파일 요청
(산정된 가격(시세추정가) 이 있을 경우에만 요청합니다)   PDF 인증키 사용 GET JSON    토지_단독의 유형을 확인 후 PDF 파일 요청
(SVC_RESULT  파라미터 보냄)
PDF 요청 호출시 PDF 인증키 사용
/api/ewha/pdfgubunbldgresult    SVC_PDF_GUBUN_BLDG_RESULT   구분 건물일 경우
PDF 파일 요청   PDF 인증키 사용 GET JSON    구분건물 유형을 확인 후 PDF 파일 요청
(SVC_GUBUN_BLDG_RESULT  파라미터 보냄)
PDF 요청 호출시 PDF 인증키 사용
/api/ewha/pdfInfo   SVC_PDF_GET_PDF_INFO    PDF 생성 Info 조회  PDF 인증키 사용 GET JSON    


공통 파라미터및 공통응답내용
공통 파라미터/응답  변수명  header 에 보냄  변수타입    필수    변수내용
요청    apiSejKey   O   string  O   데이터 관련 인증키 사용

PDF 요청 호출시 PDF 인증키 사용
    serviceId       string  O   서비스 ID
    requestId       string  O   요청 requestId (유니크한 값을 보내야 함)
데이터 관련 보낼때
"EHWA_REQ_" + 년월일시분초 + Random(6자리)

데이터 관련  호 리스트만 호출할 경우
"EHWA_HO_REQ_" + 년월일시분초 + Random(6자리)

데이터 관련  시군구 리스트 (법정동 리스트)  호출할 경우
"EHWA_BUBCODE_REQ_" + 년월일시분초 + Random(6자리)

PDF 관련 보낼때
"EHWA_PDF_REQ_" + 년월일시분초 + Random(6자리)
응답 내용   resultCode      string  O   결과 코드 "1" 이면 정상처리 
               "1" 이외에는 에러 및 경고 메세지 
    resultMessage       string  O   결과 메시지
    returnProcessId     string  O   처리 결과 ID

데이터 관련 
"EHWA_RES_" + 년월일시분초 + Random(6자리)

데이터 관련  호 리스트 받을 경우
"EHWA_HO_RES_" + 년월일시분초 + Random(6자리)

데이터 관련  시군구 리스트 (법정동 리스트)  받을 경우
"EHWA_BUBCODE_RES_" + 년월일시분초 + Random(6자리)

PDF 데이터 관련 
"EHWA_PDF_RES_" + 년월일시분초 + Random(6자리)
    requestId       string  O   요청 requestId (유니크한 값을 보내야 함)
데이터 관련 보낼때
"EHWA_REQ_" + 년월일시분초 + Random(6자리)

데이터 관련  호 리스트만 호출할 경우
"EHWA_HO_REQ_" + 년월일시분초 + Random(6자리)

데이터 관련  시군구 리스트 (법정동 리스트)  호출할 경우
"EHWA_BUBCODE_REQ_" + 년월일시분초 + Random(6자리)

PDF 관련 보낼때
"EHWA_PDF_REQ_" + 년월일시분초 + Random(6자리)
    returnExplainCode       string  O   결과에 대한 상세코드
 "1" 이면 정상처리 
 "1" 이외에는 에러 및 경고  메세지 
    returnExplainMessage        string  O   결과에 대한 상세 메시지
    resultPriceCode     string  O   가격 (시세추정가) 결과에 대한 코드

코드 값이 1 이 아닌 경우 관련 코드

코드가 999 일 경우 =>  본 물건을 정식감정이 필요합니다. 필요시 감정평가 의뢰를 선택하시면 됩니다.

토지_단독일 경우 코드 : 1099
밸류쇼핑에서  "가격자료가 충분하지 않은 부동산으로 가격산정이 정확하지 않을 수 있습니다. 그렇지만 가격을 산정하시겠습니까?"
메세지가 보일 경우 가격을 산정했을 경우 메세지입니다.
코드가  1099 일 경우에는 이 메세지가 보인 후 가격을 산정한 경우에 해당하는 내용입니다.  

구분 건물일 경우 메시지 코드  : 2100

( 밸류쇼핑에서 메시지 보여주는  부분 표시)
예 : 거래가 활발하지 않은 건물로서 인근에 본건 유사 실거래 등이 거의 존재하지 않습니다. 가격 참고 시 유의 바랍니다.

예: 거래가 활발하지 않은 특수한 건물입니다. 가격 참고 시 유의 바랍니다.

    resultPriceMessage      string  O   가격(시세추정가) 결과에 대한 메시지
예 ) 본 물건을 정식감정이 필요합니다. 필요시 감정평가 의뢰를 선택하시면 됩니다.

예 )  가격자료가 충분하지 않은 부동산으로 가격산정이 정확하지 않을 수 있습니다. 그렇지만 가격을 산정하시겠습니까?

( 밸류쇼핑에서 메시지 보여주는  부분 표시)
예 : 거래가 활발하지 않은 건물로서 인근에 본건 유사 실거래 등이 거의 존재하지 않습니다. 가격 참고 시 유의 바랍니다.

예: 거래가 활발하지 않은 특수한 건물입니다. 가격 참고 시 유의 바랍니다.


요청 파라미터
서비스명    서비스 ID   변수명  사용안함    header 에 보냄  변수타입    변수내용    비고
결과 호출
    SVC_RESULT  결과 호출 관련 설명 부동산 타입이  토지/단독일 경우
토지_단독건물 결과 내용 받음

구분 건물일 경우 동과 호의 정보를 받음
(부동산 타입 아파트, 오피스텔,다세대/연립주택 )
        apiSejKey       O   String  인증키  
        serviceId           String  서비스 ID   
        requestId           String  요청 requestId  요청 requestId
"EHWA_REQ_" + 년월일시분초Random(6자리)
        pnucode         String  필지구분을 위한 유니크한 코드   
        jibunaddr           String  지번주소    
구분 건물 
결과 호출
    SVC_GUBUN_BLDG_RESULT   apiSejKey       O   String  인증키  인증키
        serviceId           String      
        requestId           String  요청 requestId  요청 requestId
"EHWA_REQ_" + 년월일시분초Random(6자리)
        pnucode         String  필지구분을 위한 유니크한 코드
(동 리스트에 해당하는 pnu 코드) 
        jibunaddr           String  지번주소    
        etcAddrDong         String  동이름  
        etcAddrHo           String  호이름  
        dongMngno           String  동 mng번호  
        mngNo           String  mng번호 [상세 mng 번호] 
        sepArea         String  전용면적    
        commonArea          String  공용면적    
        commonArea1         String  공급면적    
        floorNo         String  층수    
        sumFam          String  전체세대수  
        floorCode           String  층코드(20:지상, 10:지하)    
        bldNm           String  건물명  
        approveDate         String  사용승인일  
        hogbnnm         String  호별로 부동산 유형 타입입니다.
[집합 건물에 해당 됩니다.]
물건 종류 
아파트  : apart
연립다세대 : rowhouse
오피스텔 : officetel    
        bubAddr         String  법정동 주소     
        dongMainusenm           String  동 용도1    
        dongEtcuse                  String  동 용도2    
        famcnt          String  동 세대수   
        dongGroundflrcnt            String  동 최고층   
        floornonm           String  해당층 이름 
호리스트    SVC_HO_LIST apiSejKey       O   String  인증키  
        serviceId           String  서비스 ID   
        requestId           String  요청 requestId  요청 requestId
"EHWA_REQ_" + 년월일시분초Random(6자리)
        pnucode         String  필지구분을 위한 유니크한 코드   
        jibunaddr           String  지번주소    
        dongMngno           String  동 mng번호
(동 리스트 정보에 
해당하는 mngno 보낸다)  
        type            String  [집합 건물에 해당 됩니다.]
물건 종류 
아파트  : apart
연립다세대 : rowhouse
오피스텔 : officetel    
시군구 리스트 호출
(법정동 리스트 호출)    SVC_BUB_LIST    apiSejKey       O   String  인증키  
        serviceId           String  서비스 ID   
        requestId           String  요청 requestId  요청 requestId
"EHWA_REQ_" + 년월일시분초Random(6자리)
        searchType          String  법정동 주소 조회  코드 타입
si : 시/도  리스트
gu : 시/군/구  리스트
dong : 읍면동 리스트
ri : 리 이름 리스트 
        si          String  시/도 이름  
        gu          String  시/군/구 이름   
        dong            String  읍/면/동 이름   
토지_단독 일 경우 
PDF 파일 요청   SVC_PDF_RESULT  토지_단독의 유형을 확인 후 PDF 파일 요청
(SVC_RESULT  파라미터 보냄)
PDF 요청 호출시 PDF 인증키 사용
구분 건물일 경우
PDF 파일 요청   SVC_PDF_GUBUN_BLDG_RESULT   구분건물 유형을 확인 후 PDF 파일 요청
(SVC_GUBUN_BLDG_RESULT  파라미터 보냄)
PDF 요청 호출시 PDF 인증키 사용
PDF 생성Info 조회   SVC_PDF_GET_PDF_INFO    apiSejKey       O   String  인증키  
        serviceId           String  서비스 ID   
        requestId           String  요청 requestId  요청 requestId
        pdfId           String  PDF 생성 ID 



시군구(동읍면) 리스트 (법정동 리스트)
서비스명    서비스 ID   Field1  Field2  Field3  Type    항목 내용   데이터 샘플
시군구 리스트 호출
(법정동 리스트 호출)    SVC_BUB_LIST    resultCode          string  결과 코드   
        resultMessage           string  결과 메시지 
        returnProcessId         string  처리 결과 ID    
        requestId           string  요청한 requestId    
        returnExplainCode           string  결과에 대한 상세코드
 "1" 이면 정상처리 
 "1" 이외에는 에러 및 경고  메세지  
        returnExplainMessage            string  결과에 대한 상세 메시지 
        result          Object      
            bubList     Object[List]        
                bub_code    string  법정동 코드
(시구  선태시 : 시 : "9"  구 선택시 : "99") 
(동읍면,리 일경우에만 결과 값 보냄
: 법정동 10자리  예제 : 5221038023) 5221038023
                result_bub_type string  법정동 결과 코드
si : 시 
gu : 구 
dong_eub : 동읍면  
ri : 리     gu
                bub_name    string  법정동 주소
result_bub_type 일 경우 주소 보여주는 내용
si : 전북특별자치도
gu : 전북특별자치도 고창군
dong_eub : 전북특별자치도 고창군 고수면
ri : 전북특별자치도 고창군 고수면 남산리    전북특별자치도 고창군 고수면 남산리


구분 건물일 경우 동_호 내용
서비스명    서비스 ID   Field1  Field2  사용여부    Field3  Type    항목 내용   데이터 샘플 비고
결과 호출   SVC_RESULT                              
        resultCode              String  결과 코드 "1" 이면 정상처리 
               "1" 이외에는 에러 및 경고 메세지     1   
        resultMessage               String  결과 메시지 정상입니다. 
        returnProcessId             String  처리 결과 ID        
        requestId               String  요청한 requestId        
        returnExplainCode               String  결과에 대한 상세코드
 "1" 이면 정상처리 
 "1" 이외에는 에러 및 경고  메세지      
        returnExplainMessage                String  결과에 대한 상세 메시지     
        result              Object          
             commonVo           Object          
                    type    String  부동산 타입
아파트 : apart 
오피스텔 : officetel
다세대/연립주택 :  rowhouse     
                    pnucode             
                    bldgNm  String  건물 이름   도곡렉슬아파트  
                    jibunaddr   String  지번 주소   서울특별시 강남구 도곡동 527    
                    sbun1   String  본번    0527    
                    sbun2   String  부번    0000    
             list           Object[List]    동 리스트       
                    dongMngno   String  동 mng 코드
(구분 건물 동에 대한 식별 코드) 11680-533   
                    dongPnuCode String  pnu 코드
( 필지구분을 위한 유니크한 코드)    1168011800105270000 
                    dongName    String  동명        
                    dongMainusenm   String  동 용도1        
                    dongEtcuse          String  동 용도2        
                    dongBldNm   String  동의 건물이름       
                    dongFamcnt  String  동 세대수       
                    dongSumfam  String  동 전체세대수       
                    dongApprovedate     String  동 사용승인일       
                    dongGroundflrcnt    String  동 최고층       
                    bubAddr String  법정동 주소         
                                    
            hoList          Object[List]    호 리스트       
                    etcAddrHo   String  호이름      
                    sepArea String  전용면적        
                    commonArea  String  공용면적        
                    commonArea1 String  공급면적 : 아파트일 경우
계약면적 : 연립다세대,오피스텔일  경우      
                    floorNo String  층수        
                    sumFam  String  전체세대수      
                    floorCode   String  층코드(20:지상, 10:지하)        
                    mngNo   String  mng번호 [상세 mng 번호]     
                    hogbnnm String  호별로 부동산 유형 타입입니다.
[집합 건물에 해당 됩니다.]
물건 종류 
아파트  : apart
연립다세대 : rowhouse
오피스텔 : officetel        
                    floorNonm   String  해당 층 이름        
                    mainusecode String  용도코드        
                    mainusenm   String  용도명      
                    hoDisplayName   String  호 디스플레이명(예제 : 101호(아파트/108.09㎡))  101호(아파트/108.09㎡)  


                    호리스트
서비스명    서비스 ID   Field1  Field2  Field3  Type    항목 내용   데이터 샘플 비고
호 정보 SVC_HO_LIST                         
        resultCode          String  결과 코드       
        resultMessage           String  결과 메시지     
        returnProcessId         String  처리 결과 ID        
        requestId           String  요청한 requestId        
        returnExplainCode           String  결과에 대한 상세코드
 "1" 이면 정상처리 
 "1" 이외에는 에러 및 경고  메세지      
        returnExplainMessage            String  결과에 대한 상세 메시지     
        result          Object          
            hoList      Object[List]            
                etcAddrHo   String  호이름      
                sepArea String  전용면적        
                commonArea  String  공용면적        
                commonArea1 String  공급면적 : 아파트일 경우
계약면적 : 연립다세대,오피스텔일  경우      
                floorNo String  층수        
                sumFam  String  전체세대수      
                floorCode   String  층코드(20:지상, 10:지하)        
                mngNo   String  mng번호 [상세 mng 번호]     
                hogbnnm String  호별로 부동산 유형 타입입니다.
[집합 건물에 해당 됩니다.]
물건 종류 
아파트  : apart
연립다세대 : rowhouse
오피스텔 : officetel        
                floorNonm   String  해당 층 이름        
                mainusecode String  용도코드        
                mainusenm   String  용도명      
                hoDisplayName   String  호 디스플레이명(예제 : 101호(아파트/108.09㎡))      


구분건물 결과 내용
서비스명    서비스 ID   Field1  Field2  Field3  Field4  Type    항목 내용   데이터 샘플 비고
구분 건물  결과 보기    SVC_GUBUN_BLDG_RESULT_LIST                              
        resultCode              String  결과 코드 "1" 이면 정상처리 
               "1" 이외에는 에러 및 경고 메세지         
        resultMessage               String  결과 메시지     
        returnProcessId             String  처리 결과 ID        
        requestId               String  요청한 requestId        
        returnExplainCode               String  결과에 대한 상세코드
 "1" 이면 정상처리 
 "1" 이외에는 에러 및 경고  메세지      
        returnExplainMessage                String  결과에 대한 상세 메시지     
        resultPriceCode             String  공통파라미터및 공통응답내용 시트 참조       
        resultPriceMessage              String  공통파라미터및 공통응답내용 시트 참조       
        result              Object          
             commonVo           Object          
                type        String  부동산 타입
아파트 : apart 
오피스텔 : officetel
다세대/연립주택 :  rowhouse     
                pnucode     String  필지구분을 위한 유니크한 코드       
                jibunaddr       String  지번주소    서울 강남구 도곡동 527  
                sbun1       String  본번    0527    
                sbun2       String  부번    0000    
            resultData          Object          
                resultprice     String  산정가격(시세추정가)    2167000000  
                resultunitprice_m       String  단가(시세추정가의 단가) 36121000    
                resultunitprice_p       String  평 기준 단가(시세추정가의 단가)(3.3㎡)  119409000   
                separea_m       String  전용면적    59.98   
                separea_p       String  전용면적(평 기준)   18.14   
                supplyarea_m        String  공급면적 : 아파트일 경우
계약면적 : 연립다세대,오피스텔일  경우  86.92   
                supplyarea_p        String  공급면적(평기준)  : 아파트일 경우
계약면적 : 연립다세대,오피스텔일 경우   26.29   
                approvedate     String  사용승인일  2006-01-27  
                floor       String  해당층  1층 
                topfloor        String  최고층  23  
                famcnt      String  세대수  3,002 세대  
                donguse     String  동 용도 공동주택    
                hohouse     String  호 용도 아파트  
                struct      String  구조    철근콘크리트구조    
                pub_siga_list       Object[List]    리스트(공동주택가격 또는 기준시가)
아파트,연립다세대 : 공동주택가격
오피스텔 : 기준시가     
                    year    String  년도    2024    
                    value   String  공동주택가격 또는 기준시가
아파트,연립다세대 : 공동주택가격
오피스텔 : 기준시가 1292000000  
                pub_rate_list       Object[List]    리스트(전년대비 %(예 2024년 공동주택가격  또는 기준시가))
아파트,연립다세대 : 공동주택가격
오피스텔 : 기준시가     
                    year    String  년도    2024    
                    value   String  전년대비 %(예 2024년 공동주택가격  또는 기준시가))
아파트,연립다세대 : 공동주택가격
오피스텔 : 기준시가 113 
                etcAddrDong     String  동이름  101동   
                etcAddrHo       String  호이름  201호   
                mngNo       String  호 mngno        

토지_단독건물 결과 내용
서비스명    서비스 ID   Field1  Field2  Field3  Field4  Field5  Field6  Field7  Type    항목 내용 1 항목 내용 2 데이터 샘플 비고
토지_단독건물 결과 내용 SVC_RESULT_LIST                                             
        resultCode                          String  결과 코드 "1" 이면 정상처리 
               "1" 이외에는 에러 및 경고 메세지             
        resultMessage                           String  결과 메시지         
        returnProcessId                         String  처리 결과 ID            
        requestId                           String  요청한 requestId            
        returnExplainCode                           String  결과에 대한 상세코드
 "1" 이면 정상처리 
 "1" 이외에는 에러 및 경고  메세지          
        returnExplainMessage                            String  결과에 대한 상세 메시지         
        resultPriceCode                         String  공통파라미터및 공통응답내용 시트 참조           
        resultPriceMessage                          String  공통파라미터및 공통응답내용 시트 참조           
        result                          Object              
             commonVo                       Object              
                type                    String  부동산 타입
토지/건물 : land            
                pnucode                 String  필지구분을 위한 유니크한 코드           
                jibunaddr                   String  지번주소        인천광역시 부평구 십정동  67-1  
                sbun1                   String  본번        67  
                sbun2                   String  부번        1   
            resultData  summaryInfo                 Object              
                    resultprice             String  산정가격(시세추정가)        1768400000  
                    landprice               String  토지가격(시세추정가의 토지가격)     1294000000  
                    landunitprice               String  토지단가(시세추정가의 단가)     1825000 
                    landarea                String  토지면적        709.00  
                    bldgprice               String  건물가격(시세추정가의 건물가격)     474400000   
                    bldgunitprice               String  건물단가(시세추정가의 단가)     721000  
                    bldgarea                String  건물연면적      657.60  
                    landunitprice_p             String  토지단가(평 기준)(시세추정가의 단가)        6033000 
                    landarea_p              String  토지면적(평 기준)       214.47  
                    bldgunitprice_p             String  건물단가(평 기준)(시세추정가의 단가)        2384000 
                    bldgarea_p              String  건물연면적(평 기준)     198.92  
                    giyukname               String  용도지역        제1종일반주거지역   
                    main_use_info_nm                String  주용도      제2종근린생활시설(제조업소,사무소)  
                    summary_gaeprice_list               Object[List]    summaryInfo 공시지가 리스트             
                        year            String  년도        2024    
                        value           String  공시지가        1315000 
                    summary_gaeprice_p_list             Object[List]    summaryInfo 공시지가(평 기준) 리스트            
                        year            String  년도        2024    
                        value           String  공시지가(평 기준)       4347107 
                    summary_compare_list                Object[List]    summaryInfo 공시지가 전년대비 %  리스트             
                        year            String  년도        2024    
                        value           String  전년대비 %(예 : 2024년 개공)        92  
                    approvedate             String  사용승인일      1991-06-05  
                landInfo                    Object  토지 기본 정보  
                    jibunaddr               String  주소        인천광역시 부평구 십정동  67-1  
                    landarea                String  면적        709.00  
                    youngdo_name                String  이용상황        주상용  
                    giyukname               String  용도지역        제1종일반주거지역   
                    dist_name               String  용도지구            
                    gita_name               String  제한구역기타            
                    jimok_name              String  지목        대  
                    hung_name               String  형상        사다리형    
                    gojeu_name              String  고저        평지    
                    jub_name                String  접면        세각(가)    
                    gaeprice_list               Object[List]    공시지가 리스트         
                        year            String  년도        2024    
                        value           String  공시지가        1226000 
                    compare_list                Object[List]    공시지가 작년대비 리스트            
                        year            String  년도        2024    
                        value           String  공시지가 작년대비       93  
                    subLandInfo             Object[List]    관련지번 토지 기본정보(리스트)          
                        jibunaddr           String      주소    인천광역시 부평구 십정동  67-3  
                        landarea            String      면적    709.00  
                        youngdo_name            String      이용상황    주상용  
                        giyukname           String      용도지역    제1종일반주거지역   
                        dist_name           String      용도지구        
                        gita_name           String      제한구역기타        
                        jimokname           String      지목    대  
                        geo_form_nm         String      형상    사다리형    
                        geo_hl_nm           String      고저    평지    
                        jub_name            String      접면    세각(가)    
                        subland_gaeprice_list           Object[List]        리스트(관련지번 공시지가 리스트)        
                            year        String      년도    2024    
                            value       String      공시지가    1226000 
                listBldgInfo                    Object[List]    건물 기본 정보(리스트)  
                            area        String  면적        657.60  
                            struc_info_nm       String  구조        철근콘크리트구조    
                            main_use_info_nm        String  주용도      제2종근린생활시설(제조업소,사무소)  
                            roof_info_nm        String  지붕        (철근)콘크리트  
                            floor_info_nm       String  층수        지하 1층 지상 2층   
                            approvedate     String  사용승인일      1991-06-05  
                            house_count     String  가구수      1   
                            pub_hprice_list     Object[List]    리스트[개별주택가격]            
                                year    String  년도        2024    
                                value   String  개별주택가격        597000000   


PDF 요청 결과 내용
서비스명    서비스 ID   Field1  Field2  Field3  Field4  Field5  Field6  Type    Description
PDF 생성 요청   SVC_PDF_RESULT
SVC_PDF_GUBUN_BLDG_RESULT   result                          
            resultCode                  String  결과 코드 "1" 이면 정상처리 
               "1" 이외에는 에러 및 경고 메세지 
            resultMessage                   String  결과 메시지
            returnProcessId                 String  처리 결과 ID
"EHWA_PDF_RES_" + 년월일시분초 + Random(6자리)
            requestId                   String  요청한 requestId 
            returnExplainCode                   String  결과에 대한 상세코드
 "1" 이면 정상처리 
 "1" 이외에는 에러 및 경고  메세지 
            returnExplainMessage                    String  결과에 대한 상세 메시지
            resultPdfId                 String  PDF 생성 ID
            urlFilePath                 String  파일 URL 경로
(파일 2개월만 보관)
PDF 생성 Info 조회  SVC_PDF_GET_PDF_INFO    result                          
            resultCode                  String  결과 코드 "1" 이면 정상처리 
               "1" 이외에는 에러 및 경고 메세지 
            resultMessage                   String  결과 메시지
            returnExplainCode                   String  결과에 대한 상세코드
 "1" 이면 정상처리 
 "1" 이외에는 에러 및 경고  메세지 
            returnExplainMessage                    String  결과에 대한 상세 메시지
            resultPdfId                 String  PDF 생성 ID
            urlFilePath                 String  파일 URL 경로
(파일 2개월만 보관) 이게 내 api문서 엑셀인데 암호가 걸려있어서 이거 내용정리해서 ai 한테 지시하려고한다 md파일로 한장으로 만들어 줘