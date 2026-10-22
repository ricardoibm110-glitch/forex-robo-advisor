#property strict
#property version "1.10"
#include <Trade/Trade.mqh>
CTrade trade;
enum EXIT_MODE { EXIT_MIDDLE=0, EXIT_OPPOSITE=1, EXIT_POINTS=2 };
input ENUM_TIMEFRAMES Timeframe=PERIOD_M5;
input int BBPeriod=20;
input double BBDeviation=2.0;
input int BBShift=0;
input ENUM_APPLIED_PRICE BBPrice=PRICE_CLOSE;
input EXIT_MODE ExitMode=EXIT_MIDDLE;
input double ExitPoints=200;
input double Lots=0.01;
input double StopLossPoints=300;
input double DailyProfitLimit=30.0;
input double DailyLossLimit=30.0;
input int MaxSpreadPoints=30;
input bool UseTrendFilter=true;
input int ADXPeriod=14;
input double MaxADX=25.0;
input bool UseExpansionFilter=true;
input double MaxWidthExpansion=1.20;
input ulong MagicNumber=20261021;
input bool StartEnabled=true;
input bool ShowPanel=true;
input bool ShowBollingerOnChart=true;
int bb=INVALID_HANDLE,adx=INVALID_HANDLE;
bool enabled=true;
datetime lastBar=0;
string buttonName="BB_EA_TOGGLE";
string panelPrefix="BB_ADVISOR_PANEL_";
bool bandsAttached=false;
datetime ServerDayStart(){
 MqlDateTime t; TimeToStruct(TimeCurrent(),t);
 t.hour=0;t.min=0;t.sec=0;
 return StructToTime(t);
}
double FloatingPL(){
 double sum=0;
 for(int i=PositionsTotal()-1;i>=0;i--){
  ulong ticket=PositionGetTicket(i);
  if(ticket>0 && PositionGetString(POSITION_SYMBOL)==_Symbol && (ulong)PositionGetInteger(POSITION_MAGIC)==MagicNumber)
   sum+=PositionGetDouble(POSITION_PROFIT)+PositionGetDouble(POSITION_SWAP);
 }
 return sum;
}
void PanelLabel(string key,string value,int y,color clr=clrWhite){
 string name=panelPrefix+key;
 if(ObjectFind(0,name)<0)ObjectCreate(0,name,OBJ_LABEL,0,0,0);
 ObjectSetInteger(0,name,OBJPROP_CORNER,CORNER_LEFT_UPPER);
 ObjectSetInteger(0,name,OBJPROP_XDISTANCE,22);
 ObjectSetInteger(0,name,OBJPROP_YDISTANCE,y);
 ObjectSetInteger(0,name,OBJPROP_COLOR,clr);
 ObjectSetInteger(0,name,OBJPROP_FONTSIZE,10);
 ObjectSetString(0,name,OBJPROP_FONT,"Arial");
 ObjectSetString(0,name,OBJPROP_TEXT,value);
 ObjectSetInteger(0,name,OBJPROP_SELECTABLE,false);
}
void UpdatePanel(){
 if(!ShowPanel)return;
 string bg=panelPrefix+"BG";
 if(ObjectFind(0,bg)<0)ObjectCreate(0,bg,OBJ_RECTANGLE_LABEL,0,0,0);
 ObjectSetInteger(0,bg,OBJPROP_CORNER,CORNER_LEFT_UPPER);
 ObjectSetInteger(0,bg,OBJPROP_XDISTANCE,12);
 ObjectSetInteger(0,bg,OBJPROP_YDISTANCE,14);
 ObjectSetInteger(0,bg,OBJPROP_XSIZE,265);
 ObjectSetInteger(0,bg,OBJPROP_YSIZE,250);
 ObjectSetInteger(0,bg,OBJPROP_BGCOLOR,C'24,31,44');
 ObjectSetInteger(0,bg,OBJPROP_COLOR,clrSlateGray);
 ObjectSetInteger(0,bg,OBJPROP_BACK,false);
 ObjectSetInteger(0,bg,OBJPROP_SELECTABLE,false);
 double realized=DayPL(),floating=FloatingPL(),total=realized+floating;
 bool stopped=(DailyProfitLimit>0 && total>=DailyProfitLimit)||(DailyLossLimit>0 && total<=-DailyLossLimit);
 PanelLabel("TITLE","BB FOREX ADVISOR  |  "+_Symbol,20,clrAqua);
 PanelLabel("STATUS",enabled?(stopped?"LIMITE DIARIO ATINGIDO":"ROBO ATIVO"):"ROBO PAUSADO",66,enabled&&!stopped?clrLime:clrOrange);
 PanelLabel("REALIZED","Resultado fechado: "+DoubleToString(realized,2),91,realized>=0?clrLime:clrTomato);
 PanelLabel("FLOAT","Resultado aberto: "+DoubleToString(floating,2),113,floating>=0?clrLime:clrTomato);
 PanelLabel("TOTAL","Total do dia: "+DoubleToString(total,2),135,total>=0?clrLime:clrTomato);
 PanelLabel("PROFIT","Meta lucro: "+DoubleToString(DailyProfitLimit,2)+" | Falta: "+DoubleToString(MathMax(0,DailyProfitLimit-total),2),160);
 PanelLabel("LOSS","Perda maxima: "+DoubleToString(DailyLossLimit,2)+" | Margem: "+DoubleToString(MathMax(0,DailyLossLimit+total),2),182);
 PanelLabel("CONFIG","Lote: "+DoubleToString(Lots,2)+" | BB: "+IntegerToString(BBPeriod)+" / "+DoubleToString(BBDeviation,2),205);
 PanelLabel("NOTE","Valores na moeda da conta | dia do servidor",236,clrSilver);
 ChartRedraw();
}
void OnTimer(){UpdatePanel();}

int OnInit(){
 if(BBPeriod<2 || BBDeviation<=0 || Lots<=0 || ExitPoints<=0 || StopLossPoints<=0 || MaxWidthExpansion<=0) return INIT_PARAMETERS_INCORRECT;
 bb=iBands(_Symbol,Timeframe,BBPeriod,BBShift,BBDeviation,BBPrice);
 adx=iADX(_Symbol,Timeframe,ADXPeriod);
 if(bb==INVALID_HANDLE || (UseTrendFilter && adx==INVALID_HANDLE)) return INIT_FAILED;
 trade.SetExpertMagicNumber(MagicNumber);
 trade.SetTypeFillingBySymbol(_Symbol);
 enabled=StartEnabled;
 ObjectCreate(0,buttonName,OBJ_BUTTON,0,0,0);
 ObjectSetInteger(0,buttonName,OBJPROP_CORNER,CORNER_LEFT_UPPER);
 ObjectSetInteger(0,buttonName,OBJPROP_XDISTANCE,15);
 ObjectSetInteger(0,buttonName,OBJPROP_YDISTANCE,41);
 ObjectSetInteger(0,buttonName,OBJPROP_XSIZE,145);
 ObjectSetInteger(0,buttonName,OBJPROP_YSIZE,30);
 UpdateButton();
 if(ShowBollingerOnChart && Period()==Timeframe){
  bandsAttached=ChartIndicatorAdd(0,0,bb);
  if(!bandsAttached)Print("Nao foi possivel exibir Bollinger no grafico: ",GetLastError());
 }else if(ShowBollingerOnChart)Print("Para exibir BB no grafico, selecione o mesmo timeframe configurado no EA.");
 EventSetTimer(1);
 UpdatePanel();
 return INIT_SUCCEEDED;
}
void UpdateButton(){
 ObjectSetString(0,buttonName,OBJPROP_TEXT,enabled?"BB EA: ATIVO":"BB EA: PAUSADO");
 ObjectSetInteger(0,buttonName,OBJPROP_BGCOLOR,enabled?clrGreen:clrFireBrick);
 UpdatePanel();
 ChartRedraw();
}
void OnChartEvent(const int id,const long &l,const double &d,const string &s){
 if(id==CHARTEVENT_OBJECT_CLICK && s==buttonName){enabled=!enabled;UpdateButton();ObjectSetInteger(0,buttonName,OBJPROP_STATE,false);}
}
void OnDeinit(const int reason){
 EventKillTimer();
 if(bandsAttached)ChartIndicatorDelete(0,0,IndicatorGetString(bb,INDICATOR_SHORTNAME));
 if(bb!=INVALID_HANDLE)IndicatorRelease(bb);
 if(adx!=INVALID_HANDLE)IndicatorRelease(adx);
 ObjectDelete(0,buttonName);
 ObjectsDeleteAll(0,panelPrefix);
}
double DayPL(){
 datetime day=ServerDayStart();
 if(!HistorySelect(day,TimeCurrent()))return 0;
 double total=0;
 for(int i=0;i<HistoryDealsTotal();i++){
  ulong t=HistoryDealGetTicket(i);
  if(HistoryDealGetInteger(t,DEAL_MAGIC)!=(long)MagicNumber || HistoryDealGetString(t,DEAL_SYMBOL)!=_Symbol)continue;
  total+=HistoryDealGetDouble(t,DEAL_PROFIT)+HistoryDealGetDouble(t,DEAL_SWAP)+HistoryDealGetDouble(t,DEAL_COMMISSION);
 }
 return total;
}
bool OwnPosition(ulong &ticket){
 for(int i=PositionsTotal()-1;i>=0;i--){
  ulong t=PositionGetTicket(i);
  if(t>0 && PositionGetString(POSITION_SYMBOL)==_Symbol && (ulong)PositionGetInteger(POSITION_MAGIC)==MagicNumber){ticket=t;return true;}
 }
 return false;
}
void OnTick(){
 UpdatePanel();
 if(!enabled)return;
 double mid[],upper[],lower[];
 ArraySetAsSeries(mid,true);ArraySetAsSeries(upper,true);ArraySetAsSeries(lower,true);
 if(CopyBuffer(bb,0,0,4,mid)<4 || CopyBuffer(bb,1,0,4,upper)<4 || CopyBuffer(bb,2,0,4,lower)<4)return;
 ulong ticket=0;
 if(OwnPosition(ticket)){
  if(!PositionSelectByTicket(ticket))return;
  long side=PositionGetInteger(POSITION_TYPE);
  double price=side==POSITION_TYPE_BUY?SymbolInfoDouble(_Symbol,SYMBOL_BID):SymbolInfoDouble(_Symbol,SYMBOL_ASK);
  double target=side==POSITION_TYPE_BUY?(ExitMode==EXIT_MIDDLE?mid[0]:lower[0]):(ExitMode==EXIT_MIDDLE?mid[0]:upper[0]);
  if(ExitMode!=EXIT_POINTS && ((side==POSITION_TYPE_BUY && price>= (ExitMode==EXIT_OPPOSITE?upper[0]:target)) || (side==POSITION_TYPE_SELL && price<= (ExitMode==EXIT_OPPOSITE?lower[0]:target))))trade.PositionClose(ticket);
  return;
 }
 datetime bar=iTime(_Symbol,Timeframe,0);
 if(bar==0 || bar==lastBar)return;
 lastBar=bar;
 double pl=DayPL()+FloatingPL();
 if((DailyProfitLimit>0 && pl>=DailyProfitLimit)||(DailyLossLimit>0 && pl<=-DailyLossLimit))return;
 if((SymbolInfoInteger(_Symbol,SYMBOL_SPREAD)>MaxSpreadPoints))return;
 if(UseTrendFilter){
  double adxValue[];
  if(CopyBuffer(adx,0,1,1,adxValue)!=1 || adxValue[0]>MaxADX)return;
 }
 if(UseExpansionFilter){
  double previousWidth=upper[2]-lower[2];
  if(previousWidth<=0 || (upper[1]-lower[1])/previousWidth>MaxWidthExpansion)return;
 }
 double close1=iClose(_Symbol,Timeframe,1);
 bool buy=close1<lower[1],sell=close1>upper[1];
 if(!buy&&!sell)return;
 double ask=SymbolInfoDouble(_Symbol,SYMBOL_ASK),bid=SymbolInfoDouble(_Symbol,SYMBOL_BID);
 double volumeStep=SymbolInfoDouble(_Symbol,SYMBOL_VOLUME_STEP);
 double minLot=SymbolInfoDouble(_Symbol,SYMBOL_VOLUME_MIN);
 if(Lots<minLot || volumeStep<=0 || MathAbs(Lots/volumeStep-MathRound(Lots/volumeStep))>0.000001)return;
 double slDistance=MathMax(StopLossPoints*_Point,(double)SymbolInfoInteger(_Symbol,SYMBOL_TRADE_STOPS_LEVEL)*_Point);
 double tpDistance=ExitPoints*_Point;
 if(ExitMode==EXIT_POINTS && tpDistance<(double)SymbolInfoInteger(_Symbol,SYMBOL_TRADE_STOPS_LEVEL)*_Point)return;
 if(buy)trade.Buy(Lots,_Symbol,0,NormalizeDouble(ask-slDistance,_Digits),ExitMode==EXIT_POINTS?NormalizeDouble(ask+tpDistance,_Digits):0,"BB mean reversion");
 else trade.Sell(Lots,_Symbol,0,NormalizeDouble(bid+slDistance,_Digits),ExitMode==EXIT_POINTS?NormalizeDouble(bid-tpDistance,_Digits):0,"BB mean reversion");
}
