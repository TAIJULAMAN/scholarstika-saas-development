"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Calculator,
  Globe,
  Users,
  School,
  MapPin,
  Building2,
  LayoutDashboard,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  calculateAnnualPrice,
  getStudentBand,
  DevelopmentCategory,
  LocationType,
  getCountryCategory,
} from "@/lib/pricing";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Country, State } from "country-state-city";

type PricingStep = "INTRO" | "BRANCHES" | "REVIEW" | "CALCULATOR" | "SUMMARY";

interface BranchInfo {
  name: string;
  address: string;
  country: string;
  state: string;
  city: string;
  locationType: LocationType;
  level: string;
  studentPopulation: string;
}

export default function PricingPage() {
  const [step, setStep] = useState<PricingStep>("INTRO");
  const [isRegisteredUser, setIsRegisteredUser] = useState(false);
  const [currentBranchIndex, setCurrentBranchIndex] = useState(1);
  const [totalBranches, setTotalBranches] = useState(1);
  const [branches, setBranches] = useState<BranchInfo[]>([]);
  const [devCategory, setDevCategory] =
    useState<DevelopmentCategory>("DEVELOPED");
  const [calcLocationType, setCalcLocationType] =
    useState<LocationType>("URBAN");
  const [studentCount, setStudentCount] = useState<number>(650);
  const [calcBranchesCount, setCalcBranchesCount] = useState<number>(1);
  const [formData, setFormData] = useState<BranchInfo>({
    name: "",
    address: "",
    country: "",
    state: "",
    city: "",
    locationType: "URBAN",
    level: "",
    studentPopulation: "",
  });

  const countries = Country.getAllCountries();
  const [states, setStates] = useState<any[]>([]);

  useEffect(() => {
    const activeAuth = localStorage.getItem("scholarstika_user");
    setIsRegisteredUser(!!activeAuth);

    const savedUser = activeAuth || localStorage.getItem("registeredUser");
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setTotalBranches(parseInt(userData.branches) || 1);
        setCalcBranchesCount(parseInt(userData.branches) || 1);

        // Pre-populate first branch with signup info
        if (currentBranchIndex === 1 && !formData.name) {
          setFormData((prev) => ({
            ...prev,
            name: userData.schoolName || "",
            country: userData.country || "",
            state: userData.state || "",
            city: userData.city || "",
          }));
        }
      } catch (err) {
        console.error("Failed to parse user data", err);
      }
    }
  }, [currentBranchIndex]);

  useEffect(() => {
    if (formData.country) {
      const countryEntry = countries.find((c) => c.name === formData.country);
      if (countryEntry) {
        setStates(State.getStatesOfCountry(countryEntry.isoCode));

        // Auto-detect country development category
        const category = getCountryCategory(formData.country);
        setDevCategory(category);
      }
    }
  }, [formData.country]);

  const handleSaveBranch = () => {
    const updatedBranches = [...branches];
    updatedBranches[currentBranchIndex - 1] = formData;
    setBranches(updatedBranches);

    if (currentBranchIndex < totalBranches) {
      setCurrentBranchIndex((prev) => prev + 1);
      setFormData({
        name: "",
        address: "",
        country: "",
        state: "",
        city: "",
        locationType: "URBAN",
        level: "",
        studentPopulation: "",
      });
    } else {
      setStep("REVIEW");
    }
  };

  const handleConfirmReview = () => {
    if (branches.length > 0) {
      const mainBranch = branches[0];
      setCalcLocationType(mainBranch.locationType);
      // Map population range to a number for the slider
      const popNum =
        parseInt(mainBranch.studentPopulation.split("-")[0]) || 650;
      setStudentCount(popNum);
    }
    setStep("CALCULATOR");
  };

  const pricingResult = useMemo(() => {
    return calculateAnnualPrice(
      studentCount,
      devCategory,
      calcLocationType,
      calcBranchesCount,
    );
  }, [studentCount, devCategory, calcLocationType, calcBranchesCount]);

  const { finalPrice, mainSchoolPrice, extraBranchCharge, basePrice } =
    pricingResult;
  const studentBand = useMemo(
    () => getStudentBand(studentCount),
    [studentCount],
  );

  const totalAnnualPrice = useMemo(() => {
    if (branches.length === 0) return finalPrice;
    return branches.reduce((sum, branch) => {
      const category = getCountryCategory(branch.country);
      const branchPopNum =
        parseInt(branch.studentPopulation.split("-")[0]) || 650;
      const branchPrice = calculateAnnualPrice(
        branchPopNum,
        category,
        branch.locationType,
        1,
      ).mainSchoolPrice;
      return sum + branchPrice;
    }, 0);
  }, [branches, finalPrice]);

  const renderIntro = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-5 text-center mt-10">
      <h1 className="text-4xl md:text-5xl font-black text-emerald-900 mb-6 max-w-4xl leading-tight">
        Simple, Fair Pricing Built for Real Schools
      </h1>
      <p className="text-lg md:text-xl text-gray-600 max-w-4xl mb-12 leading-relaxed font-medium">
        Scholarstika uses a fair pricing model designed to support schools of
        different sizes. Rather than forcing every institution into the same
        pricing bracket, we calculate pricing in a way that reflects the scale
        of the school. Every onboarded school benefits from access to the full
        Scholarstika platform and its complete feature set. Prices start from as
        little as $77 per school, while larger schools may pay more based on
        school size. Continue the onboarding process below to determine your
        school’s price and move forward with your setup.
      </p>
      <Button
        className="h-14 px-8 bg-[#00604b] hover:bg-[#004d3c] rounded-xl text-lg font-bold shadow-lg shadow-emerald-900/10 transition-all flex items-center justify-center gap-3 group"
        onClick={() => {
          if (isRegisteredUser) {
            setStep("BRANCHES");
          } else {
            window.location.href = "/auth/signup";
          }
        }}
      >
        Determine My School’s Price
        <ArrowRight
          size={20}
          className="transition-transform group-hover:translate-x-1"
        />
      </Button>
    </div>
  );

  const renderStep1 = () => (
    <div className="flex flex-col items-center">
      <div className="text-center mb-6 mt-4 relative w-full">
        <div className="absolute -top-12 right-0 md:right-10 opacity-10 pointer-events-none">
          <School size={100} className="text-emerald-900" />
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-emerald-900 mb-1">
          Welcome back!
        </h1>
        <p className="text-gray-500 font-medium text-base">
          You're almost there. Let's add the details for your{" "}
          <span className="text-emerald-600 font-bold">
            {currentBranchIndex === 1
              ? "first school"
              : `school #${currentBranchIndex}`}
          </span>
          .
        </p>
      </div>

      <Card className="w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl border-none relative overflow-visible mb-12">
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <div className="bg-white px-5 py-1.5 rounded-full shadow-md border border-gray-100 flex items-center gap-2">
            <span className="text-emerald-900 font-bold text-xs tracking-tight">
              School {currentBranchIndex} of {totalBranches}
            </span>
            <div className="w-3.5 h-3.5 rounded-full border-2 border-emerald-500 flex items-center justify-center">
              <span className="w-1 h-1 bg-emerald-500 rounded-full"></span>
            </div>
          </div>
        </div>

        <CardContent className="p-8 space-y-5 pt-10">
          <div className="grid gap-4">
            {/* School Name */}
            <div className="space-y-2">
              <Label className="text-xs font-bold text-gray-700">
                School Name <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <School
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <Input
                  placeholder="School Name"
                  className="pl-12 h-12 bg-gray-50 border-gray-100 rounded-xl focus:ring-emerald-500 focus:border-emerald-500"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </div>
            </div>

            {/* School Address */}
            <div className="space-y-2">
              <Label className="text-xs font-bold text-gray-700">
                School Address <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <MapPin
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <Input
                  placeholder="School Physical Address (e.g., 123 School St, Springfield, IL 62701)"
                  className="pl-12 h-12 bg-gray-50 border-gray-100 rounded-xl focus:ring-emerald-500 focus:border-emerald-500"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            {/* Country & State */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-gray-700">
                  Country <span className="text-red-500">*</span>
                </Label>
                <Select
                  onValueChange={(val) =>
                    setFormData((prev) => ({ ...prev, country: val }))
                  }
                  value={formData.country}
                >
                  <SelectTrigger className="h-12 bg-gray-50 border-gray-100 rounded-xl">
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((c) => (
                      <SelectItem key={c.isoCode} value={c.name}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-gray-700">
                  State/Region/Province <span className="text-red-500">*</span>
                </Label>
                <Select
                  onValueChange={(val) =>
                    setFormData((prev) => ({ ...prev, state: val }))
                  }
                  value={formData.state}
                >
                  <SelectTrigger className="h-12 bg-gray-50 border-gray-100 rounded-xl">
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map((s) => (
                      <SelectItem key={s.isoCode} value={s.name}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* City & Urban/Rural */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-gray-700">
                  City/Town/Village <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Building2
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <Input
                    placeholder="City/Town/Village"
                    className="pl-12 h-12 bg-gray-50 border-gray-100 rounded-xl focus:ring-emerald-500 focus:border-emerald-500"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, city: e.target.value }))
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-gray-700">
                  Urban or Rural <span className="text-red-500">*</span>
                </Label>
                <Select
                  onValueChange={(val) =>
                    setFormData((prev) => ({
                      ...prev,
                      locationType: val as LocationType,
                    }))
                  }
                  value={formData.locationType}
                >
                  <SelectTrigger className="h-12 bg-gray-50 border-gray-100 rounded-xl">
                    <div className="flex items-center gap-2">
                      <Globe size={16} className="text-emerald-600" />
                      <SelectValue placeholder="Select Area" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="URBAN">Urban</SelectItem>
                    <SelectItem value="RURAL">Rural</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Level & Population */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-gray-700">
                  School Type/Level <span className="text-red-500">*</span>
                </Label>
                <Select
                  onValueChange={(val) =>
                    setFormData((prev) => ({ ...prev, level: val }))
                  }
                  value={formData.level}
                >
                  <SelectTrigger className="h-12 bg-gray-50 border-gray-100 rounded-xl">
                    <SelectValue placeholder="Select Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="preschool">Preschool</SelectItem>
                    <SelectItem value="nursery_kindergarten">
                      Nursery/Kindergarten
                    </SelectItem>
                    <SelectItem value="primary_elementary">
                      Primary/Elementary
                    </SelectItem>
                    <SelectItem value="secondary_middle">
                      Secondary/Middle School
                    </SelectItem>
                    <SelectItem value="high_school">High School</SelectItem>
                    <SelectItem value="college">College</SelectItem>
                    <SelectItem value="higher_institute">
                      Higher Institute/Polytechnique
                    </SelectItem>
                    <SelectItem value="religious_institute">
                      Religious Institute
                    </SelectItem>
                    <SelectItem value="university">University</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-gray-700">
                  Student Population <span className="text-red-500">*</span>
                </Label>
                <Select
                  onValueChange={(val) =>
                    setFormData((prev) => ({ ...prev, studentPopulation: val }))
                  }
                  value={formData.studentPopulation}
                >
                  <SelectTrigger className="h-12 bg-gray-50 border-gray-100 rounded-xl">
                    <SelectValue placeholder="Select Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-100">1 – 100 students</SelectItem>
                    <SelectItem value="101-300">101 – 300 students</SelectItem>
                    <SelectItem value="301-700">301 – 700 students</SelectItem>
                    <SelectItem value="701-1500">
                      701 – 1,500 students
                    </SelectItem>
                    <SelectItem value="1501-3000">
                      1,501 – 3,000 students
                    </SelectItem>
                    <SelectItem value="3001+">3,001 and above</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-50 space-y-3">
            <Button
              className="w-full h-14 bg-[#00604b] hover:bg-[#004d3c] rounded-xl text-lg font-bold shadow-lg shadow-emerald-900/10 transition-all flex items-center justify-center gap-2 group"
              onClick={handleSaveBranch}
            >
              <LayoutDashboard size={18} />
              Save and Continue
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderReview = () => (
    <section className="container mx-auto px-5 lg:px-0 mt-6">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-xl border-none overflow-hidden bg-white/95 backdrop-blur-md rounded-2xl">
          <div className="bg-[#007b5e] px-6 py-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-lg tracking-tight">
                  Review School Information
                </h2>
                {/* <p className="text-xs text-white font-medium">
                  Review carefully.Changes are not allowed after this step.
                </p> */}
              </div>
            </div>
            <span className="text-[9px] font-black bg-white/20 px-2 py-0.5 rounded-full uppercase tracking-[0.2em]">
              Verifying {branches.length}{" "}
              {branches.length === 1 ? "School" : "Schools"}
            </span>
          </div>
          <CardContent className="pb-4 space-y-4">
            <div className="flex items-center justify-center -ml-10 ">
              <p className="text-lg text-purple-500">
                Review carefully. Changes are not allowed after this step!
              </p>
            </div>
            <div className="grid gap-4">
              {branches.map((branch, index) => (
                <div
                  key={index}
                  className="bg-gray-50/50 border border-gray-100 rounded-xl p-4 relative group"
                >
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setCurrentBranchIndex(index + 1);
                        setFormData(branch);
                        setStep("BRANCHES");
                      }}
                      className="text-[10px] text-black font-medium bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100"
                    >
                      Edit
                    </button>
                  </div>

                  <h3 className="font-black text-emerald-900 mb-2">
                    {branch.name || `School #${index + 1}`}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-x-8 gap-y-2 text-xs">
                    <div className="flex gap-2">
                      <span className="font-bold text-gray-400 w-20">
                        Address:
                      </span>
                      <span className="text-gray-600 font-medium">
                        {branch.address}, {branch.city}, {branch.state},{" "}
                        {branch.country}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-bold text-gray-400 w-20">
                        Type:
                      </span>
                      <span className="text-gray-600 font-medium capitalize">
                        {branch.level.replace("_", " ")}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-bold text-gray-400 w-20">
                        Location:
                      </span>
                      <span className="text-gray-600 font-medium capitalize">
                        {branch.locationType.toLowerCase()}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-bold text-gray-400 w-20">
                        Students:
                      </span>
                      <span className="text-gray-600 font-medium">
                        {branch.studentPopulation}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 flex flex-col md:flex-row gap-3">
              <Button
                variant="outline"
                className="flex-1 h-11 rounded-lg text-sm font-bold border-gray-200 hover:bg-gray-50 flex items-center justify-center gap-2"
                onClick={() => {
                  setCurrentBranchIndex(1);
                  setFormData(branches[0]);
                  setStep("BRANCHES");
                }}
              >
                Back to Schools
              </Button>
              <Button
                className="flex-[2] h-11 bg-[#007b5e] hover:bg-[#006b52] rounded-lg text-base font-black text-white shadow-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                onClick={handleConfirmReview}
              >
                Save & Continue
                <ArrowRight size={18} />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );

  const renderStep2 = () => (
    <section className="container mx-auto px-5 lg:px-0 mt-6">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-xl border-none overflow-hidden bg-white/95 backdrop-blur-md rounded-2xl">
          <div className="bg-[#007b5e] px-6 py-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Calculator className="h-5 w-5 text-white" />
              </div>
              <h2 className="font-bold text-lg tracking-tight">
                Pricing Strategy
              </h2>
            </div>
          </div>
          <CardContent className="p-4">
            {/* Branch Configuration Summary */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-gray-900 font-black text-sm uppercase tracking-tighter flex items-center gap-2">
                  <Globe className="h-4 w-4 text-emerald-600" />
                  Branch-wise Pricing
                </Label>
              </div>
              <div className="grid gap-2">
                {branches.map((branch, index) => {
                  const category = getCountryCategory(branch.country);
                  const branchPopNum =
                    parseInt(branch.studentPopulation.split("-")[0]) || 650;
                  const branchPrice = calculateAnnualPrice(
                    branchPopNum,
                    category,
                    branch.locationType,
                    1,
                  ).mainSchoolPrice;

                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50/80 border border-gray-100 rounded-xl p-3 hover:bg-white transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-sm font-black text-emerald-700">
                          {index + 1}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-lg font-black text-emerald-900 truncate">
                            {branch.name || `Branch #${index + 1}`}
                          </span>
                          <span className="text-sm text-gray-400 font-medium truncate">
                            {branch.city}, {branch.country}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "px-3 py-1 rounded-md text-xs font-black uppercase tracking-tight border",
                            category === "DEVELOPED"
                              ? "bg-blue-50 text-blue-700 border-blue-100"
                              : "bg-orange-50 text-orange-700 border-orange-100",
                          )}
                        >
                          {category}
                        </span>
                        <span
                          className={cn(
                            "px-3 py-1 rounded-md text-xs font-black uppercase tracking-tight border",
                            branch.locationType === "URBAN"
                              ? "bg-purple-50 text-purple-700 border-purple-100"
                              : "bg-amber-50 text-amber-700 border-amber-100",
                          )}
                        >
                          {branch.locationType}
                        </span>
                        <span className="px-3 py-1 rounded-md text-xs font-black uppercase tracking-tight bg-gray-100 text-gray-600 border-gray-200">
                          {branch.studentPopulation}
                        </span>
                        <span className="px-3 py-1 rounded-md text-xs font-black uppercase tracking-tight bg-emerald-50 text-emerald-700 border-emerald-200 border">
                          ${branchPrice}/yr
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="h-px bg-gray-100 w-full my-2" />

            <div className="pt-4 flex justify-end">
              <Button
                className="h-11 px-8 bg-[#007b5e] hover:bg-[#006b52] rounded-lg text-base font-black text-white shadow-xl flex items-center gap-2 transition-all hover:scale-[1.02]"
                onClick={() => setStep("SUMMARY")}
              >
                Payment Summary
                <ArrowRight size={18} />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );

  const renderStep3 = () => (
    <section className="container mx-auto px-5 lg:px-0 mt-10 flex justify-center pb-20">
      <Card className="w-full max-w-xl bg-[#0a192f] text-white shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5)] border-none overflow-hidden rounded-[2.5rem] relative">
        <div className="bg-[#007b5e] px-8 py-6 flex items-center justify-center border-b border-white/5">
          <div className="flex items-center gap-4">
            <Calculator className="h-6 w-6" />
            <h2 className="font-black text-2xl uppercase tracking-tighter">
              Subscription Summary
            </h2>
          </div>
        </div>

        <div className="p-8 space-y-8">
          <div className="text-center space-y-1 py-4">
            <span className="text-xs font-black text-emerald-400 uppercase tracking-[0.3em]">
              Total Annual Price
            </span>
            <div className="flex flex-col items-center">
              <div className="flex items-baseline gap-1">
                <span className="text-7xl font-black tracking-tighter">
                  ${totalAnnualPrice}
                </span>
                <span className="text-white/40 font-black text-xl">/yr</span>
              </div>
              <p className="text-[10px] text-white/30 font-medium mt-4 tracking-wide uppercase">
                Billed annually in USD • Locked for 12 mos
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <Button className="w-full h-16 bg-emerald-600 hover:bg-emerald-700 text-white text-xl font-black rounded-xl shadow-[0_10px_40px_-10px_rgba(5,150,105,0.5)] transition-all flex items-center justify-center gap-3 group">
              Proceed to Payment
              <ArrowRight className="transition-transform group-hover:translate-x-1" />
            </Button>
            <div className="flex items-center justify-center gap-2 text-white/30">
              <ShieldCheck size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Secure Encrypted Transaction
              </span>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      {(step === "BRANCHES" || step === "INTRO") && (
        <div className="absolute top-0 right-0 h-full w-1/3 opacity-30 pointer-events-none z-0 overflow-hidden hidden lg:block">
          <div className="absolute top-20 right-20 w-80 h-80 bg-emerald-100 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/2 right-40 w-96 h-96 border-[40px] border-emerald-50 rounded-[4rem] rotate-12" />
        </div>
      )}

      <div className="relative z-10 w-full min-h-screen pb-20">
        {/* Hero Gradient Background (Only for top) */}
        <div className="absolute inset-x-0 top-0 h-[500px] bg-gradient-to-b from-[#f8fafc] to-slate-50 -z-10" />

        {step === "INTRO" && renderIntro()}
        {step === "BRANCHES" && renderStep1()}
        {step === "REVIEW" && renderReview()}
        {step === "CALCULATOR" && renderStep2()}
        {step === "SUMMARY" && renderStep3()}
      </div>
    </div>
  );
}
