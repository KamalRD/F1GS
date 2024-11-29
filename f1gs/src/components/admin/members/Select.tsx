import React, { Dispatch, SetStateAction, useState } from "react";
import TagChip from "./TagChip";

export default function Select({
  allOptions,
  placeholder,
  setFilterOptions,
  currentFilterTags,
}: {
  allOptions: Array<string>;
  placeholder: string;
  setFilterOptions: Dispatch<SetStateAction<Array<string>>>;
  currentFilterTags: Array<string>;
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<Array<string>>(
    currentFilterTags ?? []
  );

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  const handleOptionSelect = (option: string) => {
    if (selectedOptions.includes(option)) {
      handleOptionRemove(option);
    } else {
      const newSelectedOptions = [...selectedOptions, option];
      setSelectedOptions(newSelectedOptions);
      setFilterOptions(newSelectedOptions);
    }
  };

  const handleOptionRemove = (option: string) => {
    const newSelectedOptions = selectedOptions.filter(
      (oldOptions) => oldOptions !== option
    );
    setSelectedOptions(newSelectedOptions);
    setFilterOptions(newSelectedOptions);
  };

  return (
    <div>
      <div
        onClick={toggleDropdown}
        className="border-2 border-solid rounded-md border-brand_grey p-2 text-sm cursor-pointer w-48 flex justify-between "
      >
        <div className="flex gap-x-2 text-gray-400 overflow-x-auto">
          {selectedOptions.length > 0
            ? selectedOptions.map((option) => (
                <div key={option} className="w-fit">
                  <TagChip chipText={option} handleClick={handleOptionRemove} />
                </div>
              ))
            : placeholder}
        </div>
        <div
          className={`w-4 h-4 my-auto transition-transform ${
            isDropdownOpen ? "rotate-180" : ""
          }`}
        >
          <svg
            id="svg"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0, 0, 400,400"
          >
            <g id="svg">
              <path
                id="path0"
                d="M193.237 83.626 C 183.544 85.544,186.847 82.545,110.319 158.909 C 47.828 221.266,38.707 230.663,36.657 234.802 C 21.976 264.441,53.217 294.481,83.180 279.536 C 85.208 278.524,106.554 257.772,143.164 221.222 L 200.000 164.478 256.836 221.222 C 293.446 257.772,314.792 278.524,316.820 279.536 C 346.783 294.481,378.024 264.441,363.343 234.802 C 359.804 227.658,220.468 88.616,214.264 86.038 C 207.011 83.025,200.216 82.245,193.237 83.626 "
                stroke="none"
                fill="rgb(75, 85, 99)"
                fillRule="evenodd"
              ></path>
            </g>
          </svg>
        </div>
      </div>

      {isDropdownOpen && (
        <ul
          className="border-2 border-solid rounded-md border-brand_grey mt-1 p-1 text-sm bg-white w-48"
          style={{
            position: "absolute",
            zIndex: 1000,
            listStyleType: "none",
          }}
        >
          {allOptions.map((option) => (
            <li
              key={option}
              onClick={() => handleOptionSelect(option)}
              className={`cursor-pointer p-2 ${
                selectedOptions.includes(option)
                  ? "bg-gray-300"
                  : "hover:bg-gray-200"
              } `}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
