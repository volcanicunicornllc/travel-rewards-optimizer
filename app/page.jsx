'use client';
import React, { useState, useMemo, useEffect } from 'react';
import {
  CreditCard,
  Plane,
  Globe,
  Star,
  Wallet,
  ArrowRightLeft,
  BedDouble,
  CheckCircle2,
  Landmark,
  Award,
  Search,
  MapPin,
} from 'lucide-react';

// === DATA SETS ===
const BANK_PROGRAMS = [
  {
    id: 'chase',
    name: 'Chase Ultimate Rewards',
    color: 'bg-blue-600',
    icon: Landmark,
    defaultVal: 150000,
  },
  {
    id: 'amex',
    name: 'Amex Membership Rewards',
    color: 'bg-slate-800',
    icon: CreditCard,
    defaultVal: 200000,
  },
  {
    id: 'cap1',
    name: 'Capital One Miles',
    color: 'bg-red-700',
    icon: Wallet,
    defaultVal: 75000,
  },
  {
    id: 'citi',
    name: 'Citi ThankYou',
    color: 'bg-sky-500',
    icon: Star,
    defaultVal: 0,
  },
  {
    id: 'bilt',
    name: 'Bilt Rewards',
    color: 'bg-black',
    icon: BedDouble,
    defaultVal: 40000,
  },
  {
    id: 'marriott',
    name: 'Marriott Bonvoy',
    color: 'bg-purple-700',
    icon: Award,
    defaultVal: 120000,
    ratio: '3:1',
  },
];

const AIRLINES = [
  {
    id: 'aeroplan',
    name: 'Air Canada Aeroplan',
    alliance: 'Star Alliance',
    domain: 'aircanada.com',
    partners: ['chase', 'amex', 'cap1', 'bilt'],
  },
  {
    id: 'ana',
    name: 'ANA Mileage Club',
    alliance: 'Star Alliance',
    domain: 'ana.co.jp',
    partners: ['amex'],
  },
  {
    id: 'avianca',
    name: 'Avianca LifeMiles',
    alliance: 'Star Alliance',
    domain: 'avianca.com',
    partners: ['amex', 'cap1', 'citi', 'bilt'],
  },
  {
    id: 'singapore',
    name: 'Singapore KrisFlyer',
    alliance: 'Star Alliance',
    domain: 'singaporeair.com',
    partners: ['chase', 'amex', 'cap1', 'citi'],
  },
  {
    id: 'united',
    name: 'United MileagePlus',
    alliance: 'Star Alliance',
    domain: 'united.com',
    partners: ['chase', 'bilt'],
  },
  {
    id: 'airfrance',
    name: 'Air France/KLM Flying Blue',
    alliance: 'SkyTeam',
    domain: 'airfrance.fr',
    partners: ['chase', 'amex', 'cap1', 'citi', 'bilt'],
  },
  {
    id: 'delta',
    name: 'Delta SkyMiles',
    alliance: 'SkyTeam',
    domain: 'delta.com',
    partners: ['amex'],
  },
  {
    id: 'virgin',
    name: 'Virgin Atlantic',
    alliance: 'SkyTeam',
    domain: 'virginatlantic.com',
    partners: ['chase', 'amex', 'cap1', 'citi', 'bilt'],
  },
  {
    id: 'american',
    name: 'American AAdvantage',
    alliance: 'Oneworld',
    domain: 'aa.com',
    partners: ['bilt'],
  },
  {
    id: 'ba',
    name: 'British Airways Avios',
    alliance: 'Oneworld',
    domain: 'britishairways.com',
    partners: ['chase', 'amex', 'cap1'],
  },
  {
    id: 'cathay',
    name: 'Cathay Pacific Asia Miles',
    alliance: 'Oneworld',
    domain: 'cathaypacific.com',
    partners: ['amex', 'cap1', 'citi', 'bilt'],
  },
  {
    id: 'qatar',
    name: 'Qatar Airways Privilege Club',
    alliance: 'Oneworld',
    domain: 'qatarairways.com',
    partners: ['citi'],
  },
  {
    id: 'aerlingus',
    name: 'Aer Lingus AerClub',
    alliance: 'Oneworld',
    domain: 'aerlingus.com',
    partners: ['chase', 'amex'],
  },
  {
    id: 'iberia',
    name: 'Iberia Plus',
    alliance: 'Oneworld',
    domain: 'iberia.com',
    partners: ['chase', 'amex'],
  },
  {
    id: 'emirates',
    name: 'Emirates Skywards',
    alliance: 'Independent',
    domain: 'emirates.com',
    partners: ['chase', 'amex', 'cap1', 'citi', 'bilt'],
  },
  {
    id: 'etihad',
    name: 'Etihad Guest',
    alliance: 'Independent',
    domain: 'etihad.com',
    partners: ['amex', 'cap1', 'citi'],
  },
  {
    id: 'hawaiian',
    name: 'HawaiianMiles',
    alliance: 'Independent',
    domain: 'hawaiianairlines.com',
    partners: ['amex', 'bilt'],
  },
];

const MAJOR_AIRPORTS = [
  { code: 'MSN', city: 'Madison', name: 'Dane County Regional Airport' },
  { code: 'ORD', city: 'Chicago', name: "O'Hare International Airport" },
  {
    code: 'HNL',
    city: 'Honolulu',
    name: 'Daniel K. Inouye International Airport',
  },
  {
    code: 'JFK',
    city: 'New York',
    name: 'John F. Kennedy International Airport',
  },
  {
    code: 'LAX',
    city: 'Los Angeles',
    name: 'Los Angeles International Airport',
  },
  {
    code: 'SFO',
    city: 'San Francisco',
    name: 'San Francisco International Airport',
  },
  { code: 'LHR', city: 'London', name: 'Heathrow Airport' },
  { code: 'HND', city: 'Tokyo (Haneda)', name: 'Haneda Airport' },
];

const TOP_ROUTES = [
  {
    destination: 'Japan (HND/NRT)',
    program: 'ANA Mileage Club',
    airlineId: 'ana',
    saver: 45000,
    typical: 90000,
    notes: 'Roundtrip required. Book 355 days out.',
  },
  {
    destination: 'Europe (LHR)',
    program: 'Flying Blue',
    airlineId: 'airfrance',
    saver: 50000,
    typical: 80000,
    notes: 'Monthly Promo Rewards can drop this.',
  },
  {
    destination: 'Hawaii (HNL)',
    program: 'Turkish Miles&Smiles',
    airlineId: 'united',
    saver: 15000,
    typical: 45000,
    notes: 'Fly United metal. Hard to find saver space.',
  },
];

export default function TravelRewardsOptimizer() {
  const [bankBalances, setBankBalances] = useState(
    BANK_PROGRAMS.reduce(
      (acc, bank) => ({ ...acc, [bank.id]: bank.defaultVal }),
      {}
    )
  );

  const [airlineBalances, setAirlineBalances] = useState({});
  const [selectedAirline, setSelectedAirline] = useState(null); // RESTORED STATE

  const [homeAirportStr, setHomeAirportStr] = useState('');
  const [homeAirport, setHomeAirport] = useState(null);
  const [dreamDestinationStr, setDreamDestinationStr] = useState('');
  const [dreamDestination, setDreamDestination] = useState(null);

  const [dynamicPricing, setDynamicPricing] = useState({
    saver: null,
    typical: null,
  });
  const [isLoadingPricing, setIsLoadingPricing] = useState(false);

  const homeSuggestions = useMemo(() => {
    if (homeAirportStr.length < 2 || homeAirport) return [];
    return MAJOR_AIRPORTS.filter(
      (a) =>
        a.code.toLowerCase().includes(homeAirportStr.toLowerCase()) ||
        a.city.toLowerCase().includes(homeAirportStr.toLowerCase())
    ).slice(0, 5);
  }, [homeAirportStr, homeAirport]);

  const dreamSuggestions = useMemo(() => {
    if (dreamDestinationStr.length < 2 || dreamDestination) return [];
    return MAJOR_AIRPORTS.filter(
      (a) =>
        a.code.toLowerCase().includes(dreamDestinationStr.toLowerCase()) ||
        a.city.toLowerCase().includes(dreamDestinationStr.toLowerCase())
    ).slice(0, 5);
  }, [dreamDestinationStr, dreamDestination]);

  const fetchRealPricing = async (homeCode, dreamCode) => {
    setIsLoadingPricing(true);
    setDynamicPricing({ saver: null, typical: null });

    try {
      const response = await fetch(
        `/api/flights?origin=${homeCode}&destination=${dreamCode}`
      );
      const data = await response.json();

      if (data.error) {
        console.error('Backend Error:', data.error);
        setDynamicPricing({ saver: 'Error', typical: 'Error' });
      } else {
        setDynamicPricing({ saver: data.saver, typical: data.typical });
      }
    } catch (error) {
      console.error('Network Error', error);
      setDynamicPricing({ saver: 'Error', typical: 'Error' });
    } finally {
      setIsLoadingPricing(false);
    }
  };

  useEffect(() => {
    if (homeAirport && dreamDestination) {
      fetchRealPricing(homeAirport.code, dreamDestination.code);
    }
  }, [homeAirport, dreamDestination]);

  const handleBankChange = (id, val) => {
    const num = parseInt(val.replace(/,/g, '')) || 0;
    setBankBalances((prev) => ({ ...prev, [id]: num }));
  };

  const formatNumber = (num) => {
    if (num === 'N/A' || num === 'Error') return num;
    if (!num) return 'N/A'; // Fixed bug: prevents undefined from rendering as '0'
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-24">
      <header className="bg-slate-900 text-white p-6 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Globe className="text-blue-400" /> Travel Rewards Optimizer
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto mt-8 px-6 space-y-12">
        {/* SECTION 1: BANKS */}
        <section>
          <div className="flex items-center gap-2 mb-6 border-b border-slate-200 pb-2">
            <Landmark className="text-slate-500" />
            <h2 className="text-xl font-bold text-slate-800">
              1. Your Bank Rewards
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {BANK_PROGRAMS.map((bank) => (
              <div
                key={bank.id}
                className="bg-white rounded-xl shadow-sm border border-slate-100 p-4"
              >
                <div
                  className={`w-8 h-8 rounded-full ${bank.color} flex items-center justify-center mb-3 shadow-sm`}
                >
                  <bank.icon size={16} className="text-white" />
                </div>
                <label className="block text-xs font-semibold text-slate-500 mb-1 h-8">
                  {bank.name}
                </label>
                <input
                  type="text"
                  value={formatNumber(bankBalances[bank.id])}
                  onChange={(e) => handleBankChange(bank.id, e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md p-2 text-lg font-bold text-slate-800 outline-none"
                />
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 2: AIRLINES (RESTORED CLICK EVENT) */}
        <section>
          <div className="flex items-center gap-2 mb-6 border-b border-slate-200 pb-2">
            <ArrowRightLeft className="text-slate-500" />
            <h2 className="text-xl font-bold text-slate-800">
              2. Transfer Partners Matrix
            </h2>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-sm text-left">
              <tbody className="divide-y divide-slate-100">
                {AIRLINES.map((airline) => {
                  let totalPotential = airlineBalances[airline.id] || 0;
                  airline.partners.forEach((partnerId) => {
                    if (partnerId === 'marriott')
                      totalPotential += Math.floor(bankBalances[partnerId] / 3);
                    else totalPotential += bankBalances[partnerId];
                  });

                  const isSelected = selectedAirline === airline.id;

                  return (
                    <tr
                      key={airline.id}
                      onClick={() => setSelectedAirline(airline.id)}
                      className={`transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-blue-50 border-l-4 border-blue-500'
                          : 'hover:bg-slate-50 border-l-4 border-transparent'
                      }`}
                    >
                      <td className="px-6 py-4 border-r border-slate-100 w-64">
                        <div className="flex items-center gap-3">
                          <img
                            src={`https://logo.clearbit.com/${airline.domain}`}
                            className="w-8 h-8 rounded-full border border-slate-200 bg-white object-contain p-0.5"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                          <div>
                            <div
                              className={`font-bold ${
                                isSelected ? 'text-blue-900' : 'text-slate-800'
                              }`}
                            >
                              {airline.name}
                            </div>
                            <div className="text-xs text-slate-500">
                              {airline.alliance}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex gap-2">
                            {BANK_PROGRAMS.map((bank) => {
                              const isPartner = airline.partners.includes(
                                bank.id
                              );
                              return (
                                <div
                                  key={bank.id}
                                  className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                    isPartner ? bank.color : 'bg-slate-100'
                                  } ${!isPartner && 'opacity-30'}`}
                                >
                                  <bank.icon
                                    size={12}
                                    className={
                                      isPartner
                                        ? 'text-white'
                                        : 'text-slate-400'
                                    }
                                  />
                                </div>
                              );
                            })}
                          </div>
                          <div className="font-mono text-lg font-bold text-slate-800 bg-white border border-slate-200 px-3 py-1 rounded-md shadow-sm">
                            {formatNumber(totalPotential)}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* SECTION 3: LIVE PRICING */}
        <section>
          <div className="flex items-center gap-2 mb-6 border-b border-slate-200 pb-2">
            <CheckCircle2 className="text-slate-500" />
            <h2 className="text-xl font-bold text-slate-800">
              3. Dynamic Sweet Spots & Live Pricing
            </h2>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Route Selection</th>
                  <th className="px-6 py-4 w-48 border-l border-slate-100 bg-emerald-50 text-emerald-700">
                    Saver Price
                  </th>
                  <th className="px-6 py-4 w-48 border-l border-slate-100">
                    Typical / Average
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="bg-blue-50/30">
                  <td className="px-6 py-6 border-r border-slate-100">
                    <div className="flex gap-4 relative">
                      <div className="relative w-full">
                        <label className="block text-xs font-semibold text-slate-500 mb-1">
                          Home Airport
                        </label>
                        <input
                          type="text"
                          placeholder="ORD"
                          value={homeAirportStr}
                          onChange={(e) => {
                            setHomeAirportStr(e.target.value);
                            setHomeAirport(null);
                          }}
                          className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 text-slate-700 outline-none shadow-sm"
                        />
                        {homeSuggestions.length > 0 && (
                          <div className="absolute z-10 w-full bg-white border border-slate-200 shadow-xl rounded-md mt-1 overflow-hidden">
                            {homeSuggestions.map((a) => (
                              <div
                                key={a.code}
                                className="px-4 py-2 hover:bg-slate-50 cursor-pointer border-b border-slate-50"
                                onClick={() => {
                                  setHomeAirport(a);
                                  setHomeAirportStr(`${a.city} (${a.code})`);
                                }}
                              >
                                <div className="font-bold text-slate-700">
                                  {a.city}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="relative w-full">
                        <label className="block text-xs font-semibold text-slate-500 mb-1">
                          Destination
                        </label>
                        <input
                          type="text"
                          placeholder="HNL"
                          value={dreamDestinationStr}
                          onChange={(e) => {
                            setDreamDestinationStr(e.target.value);
                            setDreamDestination(null);
                          }}
                          className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 text-slate-700 outline-none shadow-sm"
                        />
                        {dreamSuggestions.length > 0 && (
                          <div className="absolute z-10 w-full bg-white border border-slate-200 shadow-xl rounded-md mt-1 overflow-hidden">
                            {dreamSuggestions.map((a) => (
                              <div
                                key={a.code}
                                className="px-4 py-2 hover:bg-slate-50 cursor-pointer border-b border-slate-50"
                                onClick={() => {
                                  setDreamDestination(a);
                                  setDreamDestinationStr(
                                    `${a.city} (${a.code})`
                                  );
                                }}
                              >
                                <div className="font-bold text-slate-700">
                                  {a.city}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-6 border-l border-slate-200 align-middle">
                    {isLoadingPricing ? (
                      <div className="text-slate-400 text-sm animate-pulse">
                        Fetching API...
                      </div>
                    ) : dynamicPricing.saver !== null ? (
                      <div
                        className={`font-mono text-xl font-bold ${
                          dynamicPricing.saver === 'Error'
                            ? 'text-red-500'
                            : 'text-emerald-700'
                        }`}
                      >
                        {dynamicPricing.saver === 'N/A' ||
                        dynamicPricing.saver === 'Error'
                          ? dynamicPricing.saver
                          : formatNumber(dynamicPricing.saver)}
                      </div>
                    ) : (
                      <div className="text-slate-400 text-sm italic">
                        Select airports
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-6 border-l border-slate-200 align-middle">
                    {isLoadingPricing ? (
                      <div className="text-slate-400 text-sm animate-pulse">
                        Fetching API...
                      </div>
                    ) : dynamicPricing.typical !== null ? (
                      <div className="font-mono text-lg font-semibold text-slate-600">
                        {dynamicPricing.typical === 'N/A' ||
                        dynamicPricing.typical === 'Error'
                          ? dynamicPricing.typical
                          : formatNumber(dynamicPricing.typical)}
                      </div>
                    ) : (
                      <div className="text-slate-400 text-sm italic">
                        Select airports
                      </div>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
