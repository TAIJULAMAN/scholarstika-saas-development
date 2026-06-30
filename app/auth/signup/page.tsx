"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  School,
  Building2,
  Check,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/user-context";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Country, State } from "country-state-city";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSignUpMutation } from "@/redux/features/auth/authApi";

export default function SignUpPage() {
  const router = useRouter();
  const { login } = useUser();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    schoolName: "",
    password: "",
    confirmPassword: "",
    country: "",
    countryIso: "",
    city: "",
    state: "",
    isOwner: "",
    ownerType: "",
    branches: "",
    termsAccepted: false,
  });

  const countries = Country.getAllCountries();
  const [states, setStates] = useState<any[]>([]);
  const [signUp] = useSignUpMutation();

  useEffect(() => {
    if (formData.countryIso) {
      setStates(State.getStatesOfCountry(formData.countryIso));
    } else {
      setStates([]);
    }
  }, [formData.countryIso]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.isOwner || !formData.ownerType || !formData.branches) {
        setError("Please answer all questions");
        return;
      }

      // Auto-set role based on owner type
      if (formData.isOwner === "yes") {
        if (formData.ownerType === "single_institution") {
          setSelectedRole("branch_manager");
        } else if (formData.ownerType === "multiple_institutions") {
          setSelectedRole("institution_manager");
        }
      }

      setError("");
      setStep(2);
    }
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword ||
      !selectedRole ||
      !formData.schoolName ||
      !formData.country ||
      !formData.state ||
      !formData.city
    ) {
      setError("Please fill in all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const validatePassword = (pass: string) => {
      const hasUpper = /[A-Z]/.test(pass);
      const hasLower = /[a-z]/.test(pass);
      const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
      const isNotNumericOnly = /[^0-9]/.test(pass);
      return (
        pass.length >= 8 &&
        hasUpper &&
        hasLower &&
        hasSpecial &&
        isNotNumericOnly
      );
    };

    if (!validatePassword(formData.password)) {
      setError(
        "Password must be at least 8 characters long, and have at least one uppercase, lowercase, and special character. It cannot be numbers only.",
      );
      return;
    }

    if (!formData.termsAccepted) {
      setError("Please accept the terms and conditions");
      return;
    }

    setLoading(true);

    // Map frontend role to backend role
    const roleMap: Record<string, string> = {
      institution_manager: "ADMIN",
      branch_manager: "BRANCH_MANAGER",
    };

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        schoolName: formData.schoolName,
        password: formData.password,
        role: roleMap[selectedRole] || selectedRole.toUpperCase(),
        country: formData.country,
        city: formData.city,
        state: formData.state,
        branches: Number(formData.branches) || 1,
      };

      const res = await signUp(payload).unwrap();

      // On success, redirect to sign in
      router.push("/auth/signin");
    } catch (err: any) {
      // Handle API error response
      const errorMessage =
        err?.data?.message ||
        err?.data?.errorMessages?.[0]?.message ||
        "Failed to create account. Please try again.";
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50/50 p-4 relative overflow-hidden">
      {/* Background enhancement */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-300 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-200 rounded-full blur-3xl" />
      </div>
      <div className="w-full max-w-2xl bg-white rounded-[2.5rem] shadow-xl shadow-emerald-900/5 p-8 md:p-12 relative z-10 border border-emerald-50">
        <div className="flex justify-between items-center mb-12">
          <div className="relative h-12 w-48">
            <Image
              src="/logo.png"
              alt="Scholarstika"
              fill
              className="object-contain object-left"
            />
          </div>
          <div className="text-sm font-medium text-gray-500">
            Step {step} of 2
          </div>
        </div>
        <CardHeader className="space-y-4 p-0 mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
            {step === 1
              ? "Set up your Scholarstika account"
              : "Tell us about your institution."}
          </h1>
          <p className="text-lg text-gray-500 font-medium max-w-md mx-auto">
            {step === 1
              ? "Choose the option that best matches your school organization."
              : "Enter your details to create your Scholarstika account."}
          </p>
        </CardHeader>
        <CardContent>
          {/* Error Message */}
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
              {error}
            </div>
          )}
          {step === 1 ? (
            <div className="space-y-6">
              {/* Which type of owner you are? */}
              <div className="space-y-6 pt-2">
                <h2 className="text-xl font-bold text-gray-900 text-center">
                  How many schools do you manage?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div
                    className={cn(
                      "relative flex flex-col items-center justify-center p-8 border-2 rounded-[2rem] cursor-pointer transition-all duration-300 group",
                      formData.ownerType === "single_institution"
                        ? "border-emerald-600 bg-emerald-50/50 shadow-lg shadow-emerald-600/5"
                        : "border-gray-100 bg-white hover:border-emerald-200 hover:bg-emerald-50/20",
                    )}
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        ownerType: "single_institution",
                        isOwner: "yes",
                        branches: "1",
                      }))
                    }
                  >
                    <div
                      className={cn(
                        "absolute top-4 right-4 h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors",
                        formData.ownerType === "single_institution"
                          ? "border-emerald-600 bg-emerald-600"
                          : "border-gray-200",
                      )}
                    >
                      {formData.ownerType === "single_institution" && (
                        <Check className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <div
                      className={cn(
                        "p-4 rounded-2xl mb-4 transition-colors",
                        formData.ownerType === "single_institution"
                          ? "bg-emerald-100/50 text-emerald-600"
                          : "bg-gray-50 text-gray-400 group-hover:text-emerald-500",
                      )}
                    >
                      <School size={40} />
                    </div>
                    <div className="text-center group">
                      <h3
                        className={cn(
                          "font-bold text-base transition-colors",
                          formData.ownerType === "single_institution"
                            ? "text-emerald-900"
                            : "text-gray-900",
                        )}
                      >
                        I Own/Manage One School
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        For a single school or campus
                      </p>
                    </div>
                  </div>
                  <div
                    className={cn(
                      "relative flex flex-col items-center justify-center p-8 border-2 rounded-[2rem] cursor-pointer transition-all duration-300 group",
                      formData.ownerType === "multiple_institutions"
                        ? "border-emerald-600 bg-emerald-50/50 shadow-lg shadow-emerald-600/5"
                        : "border-gray-100 bg-white hover:border-emerald-200 hover:bg-emerald-50/20",
                    )}
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        ownerType: "multiple_institutions",
                        isOwner: "yes",
                        branches:
                          prev.ownerType === "multiple_institutions"
                            ? prev.branches
                            : "2",
                      }))
                    }
                  >
                    <div
                      className={cn(
                        "absolute top-4 right-4 h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors",
                        formData.ownerType === "multiple_instiutions"
                          ? "border-emerald-600 bg-emerald-6t00"
                          : "border-gray-200",
                      )}
                    >
                      {formData.ownerType === "multiple_institutions" && (
                        <Check className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <div
                      className={cn(
                        "p-4 rounded-2xl mb-4 transition-colors",
                        formData.ownerType === "multiple_institutions"
                          ? "bg-emerald-100/50 text-emerald-600"
                          : "bg-gray-50 text-gray-400 group-hover:text-emerald-500",
                      )}
                    >
                      <Building2 size={40} />
                    </div>
                    <div className="text-center group">
                      <h3
                        className={cn(
                          "font-bold text-base transition-colors",
                          formData.ownerType === "multiple_institutions"
                            ? "text-emerald-900"
                            : "text-gray-900",
                        )}
                      >
                        I Own/Manage More Than One School
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        For two or more schools, branches, or campuses
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* How many branches of your school? */}
              {formData.ownerType === "multiple_institutions" && (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                  <Label htmlFor="branches" className="font-medium">
                    How many school branches/campuses do you own or manage?{" "}
                  </Label>
                  <Input
                    id="branches"
                    type="number"
                    placeholder="Enter number of branches"
                    value={formData.branches}
                    onChange={handleInputChange}
                    min="2"
                    className="h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>
              )}
              <Button
                onClick={nextStep}
                className="w-full bg-[#007b5e] hover:bg-[#006b52] h-14 rounded-2xl text-lg font-bold shadow-lg shadow-emerald-900/10 transition-all active:scale-[0.98]"
                size="lg"
              >
                Continue setup
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="name"
                  className="text-gray-900 font-bold flex items-center gap-1"
                >
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <p className="text-[10px] text-gray-500 font-medium">
                  Name of owner/representative
                </p>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Dialle MaPau"
                    className="pl-12 h-12 bg-gray-50/50 border-gray-200 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 transition-all font-medium"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="email"
                  className="text-gray-900 font-bold flex items-center gap-1"
                >
                  Email <span className="text-red-500">*</span>
                </Label>
                <p className="text-[10px] text-gray-500 font-medium">
                  E-mail of owner/representative
                </p>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="diallemapau@gmail.com"
                    className="pl-12 h-12 bg-gray-50/50 border-gray-200 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 transition-all font-medium"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              {/* School/Company Name */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="schoolName"
                  className="text-gray-900 font-bold flex items-center gap-1"
                >
                  School Name <span className="text-red-500">*</span>
                </Label>
                <p className="text-[10px] text-gray-500 font-medium">
                  Main Campus/Branch/Headquarters
                </p>
                <div className="relative">
                  <School className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="schoolName"
                    type="text"
                    placeholder="Baptist High School"
                    className="pl-12 h-12 bg-gray-50/50 border-gray-200 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 transition-all font-medium text-sm"
                    value={formData.schoolName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              {/* Password and Confirm Password Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="password"
                    title="At least 8 characters, one uppercase, one lowercase, one special character, and not numeric only."
                    className="text-gray-900 font-bold flex items-center gap-1"
                  >
                    Password <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-12 pr-12 h-12 bg-gray-50/50 border-gray-200 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 transition-all font-medium"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="confirmPassword"
                    title="Must match the password above."
                    className="text-gray-900 font-bold flex items-center gap-1"
                  >
                    Confirm Password <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-12 pr-12 h-12 bg-gray-50/50 border-gray-200 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 transition-all font-medium"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Country, State, City */}
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="country"
                    className="text-gray-900 font-bold flex items-center gap-1"
                  >
                    Country <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    onValueChange={(value) => {
                      const country = countries.find(
                        (c) => c.isoCode === value,
                      );
                      setFormData((prev) => ({
                        ...prev,
                        country: country?.name || "",
                        countryIso: value,
                        state: "",
                      }));
                    }}
                    value={formData.countryIso}
                  >
                    <SelectTrigger className="h-12 bg-gray-50/50 border-gray-200 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 font-medium">
                      <SelectValue placeholder="Select Country" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {countries.map((country) => (
                        <SelectItem
                          key={country.isoCode}
                          value={country.isoCode}
                        >
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="state"
                    className="text-gray-900 font-bold flex items-center gap-1"
                  >
                    State/Region/Province{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    onValueChange={(value) => {
                      setFormData((prev) => ({
                        ...prev,
                        state: value,
                      }));
                    }}
                    value={formData.state}
                    disabled={!formData.countryIso}
                  >
                    <SelectTrigger className="h-12 bg-gray-50/50 border-gray-200 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 font-medium">
                      <SelectValue
                        placeholder={
                          formData.countryIso
                            ? "Select State/Region"
                            : "Select a country first"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {states.length > 0 ? (
                        states.map((state) => (
                          <SelectItem key={state.isoCode} value={state.name}>
                            {state.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled>
                          No states found
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="city"
                    className="text-gray-900 font-bold flex items-center gap-1"
                  >
                    City/Town/Village
                  </Label>
                  <Input
                    id="city"
                    type="text"
                    placeholder="Groveport"
                    className="h-12 bg-gray-50/50 border-gray-200 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 transition-all font-medium"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="termsAccepted"
                  className="h-5 w-5 rounded-md border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  checked={formData.termsAccepted}
                  onChange={handleInputChange}
                  required
                />
                <label
                  htmlFor="termsAccepted"
                  className="text-sm text-gray-900 font-medium cursor-pointer"
                >
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="text-emerald-600 hover:underline decoration-2 underline-offset-2"
                  >
                    Terms & Privacy
                  </Link>
                </label>
              </div>

              <div className="flex gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 h-14 rounded-2xl text-lg font-bold border-gray-200 text-gray-900 hover:bg-gray-50 transition-all"
                  onClick={prevStep}
                  disabled={loading}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  className="flex-[2] bg-[#007b5e] hover:bg-[#006b52] h-14 rounded-2xl text-lg font-bold shadow-lg shadow-emerald-900/10 transition-all active:scale-[0.98]"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create Account"}
                </Button>
              </div>
            </form>
          )}

          {/* Sign In Link */}
          <div className="text-center text-sm mt-6">
            Already have an account?{" "}
            <Link
              href="/auth/signin"
              className="font-semibold text-emerald-600 hover:underline"
            >
              Sign in
            </Link>
          </div>
        </CardContent>
      </div>
    </div>
  );
}
